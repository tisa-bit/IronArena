import express from "express";
import planRoute from "./plans/index.js";
// import subscriptionRoute from "./subscription/index.js"
const router = express.Router();
router.use("/plans", planRoute);
// router.use("/subscription",subscriptionRoute)
export default router;
