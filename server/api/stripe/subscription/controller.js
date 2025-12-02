import service from "./service.js";

const createCheckout = async (req, res) => {
  try {
    const data = await service.createCheckoutService(req.user, req.body.planId);
    // console.log(data);

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getActiveSubscription = async (req, res) => {
  try {
    const data = await service.getTransactionsService(req.query);
    return res.json(data);
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
const webhookPayment = async (req, res) => {
  try {
    const result = await service.handleCheckoutSessionCompleted(req);
   
    return res.status(result.status || 200).send("Webhook received");
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
};

export default { createCheckout, webhookPayment, getActiveSubscription };
