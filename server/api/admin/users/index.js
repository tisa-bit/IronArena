import express from "express";
import profileRoute from "./profile/index.js";
import progressRoute from "./progress/index.js";
import reportRouter from "./report/index.js";
const router = express.Router();
router.use("/profile", profileRoute);
router.use("/progress", progressRoute);
router.use("/report", reportRouter);
export default router;
