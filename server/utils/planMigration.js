import Stripe from "stripe";
import prisma from "../models/prismaClient.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function importStripePlans() {
  try {
    const prices = await stripe.prices.list({ expand: ["data.product"] });

    for (const price of prices.data) {
      if (price.recurring?.interval !== "year") continue;

      await prisma.plan.upsert({
        where: { priceId: price.id },
        update: {
          name: price.product.name,
          amount: price.unit_amount,
          currency: price.currency,
          plandescription: price.product.description || "",
        },
        create: {
          name: price.product.name,
          priceId: price.id,
          amount: price.unit_amount,
          currency: price.currency,
          plandescription: price.product.description || "",
        },
      });
    }

    console.log("Stripe plans imported successfully!");
  } catch (err) {
    console.error("Error importing Stripe plans:", err);
    throw err;
  }
}
