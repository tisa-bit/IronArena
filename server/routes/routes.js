import express from "express";
import authRoute from "../api/auth/index.js";
import adminRoute from "../api/admin/index.js";
import userRoute from "../api/users/index.js";
import stripeRoute from "../api/stripe/index.js";
const router = express.Router();

router.use("/auth", authRoute);
router.use("/admin", adminRoute);
router.use("/users", userRoute);
router.use("/stripe", stripeRoute);

export default router;
