import prisma from "../models/prismaClient.js";
import stripe from "../models/stripeClient.js";

export const handleCheckOutSuccess = async (session) => {
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription
  );

  const userId = Number(subscription.metadata.userId);
  const planId = Number(subscription.metadata.planId);

  if (!userId) throw new Error("userId is missing in subscription");
  if (!planId) throw new Error("planId missing in metadata");

  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (existingSub) {
    console.log("Subscription already processed. Skipping duplicate.");
    return;
  }
  const activeSub = await prisma.subscription.findFirst({
    where: { userId, status: "active" },
  });
  if (activeSub) {
    console.log("already a membeer of the plan");
    return { status: 200 };
  }

  await prisma.subscription.updateMany({
    where: { checkoutSessionId: session.id },
    data: {
      userId,
      planId,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      status: "active",
      currentPeriodStart: new Date(),
    },
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: session.customer,
      planId,
      isMember: true,
      subscriptionStatus: "active",
    },
  });

  const plan = await prisma.plan.findUnique({ where: { id: planId } });

  const admins = await prisma.user.findMany({
    where: { role: "Admin" },
    select: { email: true },
  });

  const adminEmails = admins.map((admin) => admin.email);

  const html = await ejs.renderFile(
    path.resolve("modules/template/userSubscription.ejs"),
    {
      baseurl: process.env.SERVER_URL,
      user,
      plan,
    }
  );

  await transporter.sendMail({
    from: process.env.MAILER_FROM,
    to: adminEmails,
    subject: "user subscription successful",
    html,
  });
  return { status: 200 };
};

export const handleInvoiceSuccess = async (invoice) => {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription },
  });

  const existingInvoice = await prisma.invoice.findUnique({
    where: { stripeInvoiceId: invoice.id },
  });
  if (existingInvoice) return;

  if (!subscription) throw new Error("no subscription exsist");

  await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      invoicePdfUrl: invoice.invoice_pdf,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency,
      invoiceDate: new Date(invoice.created * 1000),
    },
  });
};
