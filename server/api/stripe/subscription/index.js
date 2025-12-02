import express from "express";
import controller from "./controller.js";
import auth, { verifySubscriptionToken } from "../../../middleware/auth.js";

const router = express.Router();

router.post("/", controller.webhookPayment);

// Checkout session route
router.post(
  "/create-checkout-session",
  verifySubscriptionToken,
  controller.createCheckout
);

router.get("/getTransactions", auth, controller.getActiveSubscription);
export default router;
