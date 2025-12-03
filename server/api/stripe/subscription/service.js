import prisma from "../../../models/prismaClient.js";
import stripe from "../../../models/stripeClient.js";
import {
  handleCheckOutSuccess,
  handleInvoiceSuccess,
} from "../../../utils/stripeUtils.js";

export const createCheckoutService = async (user, planId) => {
  const userId = user.id;
  let dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!dbUser) throw new Error("User does not exist");

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Plan does not exist");
  if (!dbUser.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      name: `${dbUser.firstname} ${dbUser.lastname}`,
    });

    dbUser = await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });
  }

  const existingActiveSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["active", "trialing"] },
    },
  });

  if (existingActiveSub) {
    throw new Error("User already has an active subscription");
  }

  // 5️⃣ Check abandoned/incomplete checkout sessions
  const existingIncomplete = await prisma.subscription.findFirst({
    where: {
      userId,
      planId,
      status: "incomplete",
    },
  });

  if (existingIncomplete) {
    try {
      const oldSession = await stripe.checkout.sessions.retrieve(
        existingIncomplete.checkoutSessionId
      );

      if (oldSession?.status === "open") {
        return {
          url: oldSession.url,
          message: "Reusing existing checkout session",
        };
      }

      await prisma.subscription.update({
        where: { id: existingIncomplete.id },
        data: {
          status: "expired",
        },
      });
    } catch (err) {
      await prisma.subscription.update({
        where: { id: existingIncomplete.id },
        data: { status: "expired" },
      });
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: dbUser.stripeCustomerId,
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    subscription_data: {
      metadata: {
        userId: String(userId),
        planId: String(planId),
      },
    },
    success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
  });

  await prisma.subscription.create({
    data: {
      userId,
      planId,
      status: "incomplete",
      checkoutSessionId: session.id,
      stripeCustomerId: dbUser.stripeCustomerId,
    },
  });

  return { url: session.url };
};

const getTransactionsService = async (data) => {
  try {
    const {
      search = "",
      startDate,
      endDate,
      page = 1,
      limit = 5,
      userId,
    } = data;

    const actuallimit = parseInt(limit);
    const skip = (page - 1) * actuallimit;

    const whereClause = {};

    if (startDate || endDate) {
      whereClause.invoiceDate = {};
      if (startDate) {
        whereClause.invoiceDate.gte = new Date(
          new Date(startDate).setHours(0, 0, 0, 0)
        );
      }
      if (endDate) {
        whereClause.invoiceDate.lte = new Date(
          new Date(endDate).setHours(23, 59, 59, 999)
        );
      }
    }

    if (userId) {
      const numericUserId = Number(userId);
      whereClause.subscription = {
        ...whereClause.subscription,
        user: { id: numericUserId },
      };
    }

    if (search) {
      whereClause.OR = [
        {
          subscription: {
            user: {
              OR: [
                { firstname: { contains: search, mode: "insensitive" } },
                { lastname: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
        {
          subscription: {
            plan: { name: { contains: search, mode: "insensitive" } },
          },
        },
      ];
    }

    const totalCount = await prisma.invoice.count({ where: whereClause });

    const transactions = await prisma.invoice.findMany({
      where: whereClause,
      orderBy: { invoiceDate: "desc" },
      skip,
      take: actuallimit,
      include: {
        subscription: {
          include: {
            user: { select: { firstname: true, lastname: true, email: true } },
            plan: { select: { name: true, amount: true, currency: true } },
          },
        },
      },
    });

    const formatted = transactions.map((tx) => ({
      username: `${tx.subscription.user.firstname} ${tx.subscription.user.lastname}`,
      date: tx.invoiceDate,
      planName: tx.subscription.plan.name,
      amount: tx.amountPaid / 100,
      currency: tx.currency.toUpperCase(),
      invoiceNo: tx.stripeInvoiceId,
      invoicePdfUrl: tx.invoicePdfUrl,
    }));

    return {
      transactions: formatted,
      meta: {
        total: totalCount,
        page: Number(page),
        limit: actuallimit,
        totalPages: Math.ceil(totalCount / actuallimit),
      },
      message: "Transactions fetched successfully",
    };
  } catch (error) {
    return {
      transactions: [],
      meta: { total: 0, page: 1, limit: 5, totalPages: 1 },
      message: "Failed to fetch transactions",
    };
  }
};

const handleCheckoutSessionCompleted = async (req) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { status: 400, message: "Invalid signature" };
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await handleCheckOutSuccess(session);
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    await handleInvoiceSuccess(invoice);
  }
  return { status: 200 };
};

export default {
  createCheckoutService,
  handleCheckoutSessionCompleted,
  getTransactionsService,
};
