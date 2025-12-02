import express from "express";
import controlsRoute from "./controls/index.js";
import profileRoute from "./profile/index.js";
import progressRoute from "./progress/index.js";
import logRouter from "./logs/index.js";

const router = express.Router();

router.use("/controls", controlsRoute);

router.use("/profile", profileRoute);
router.use("/progress", progressRoute);
router.use("/logs", logRouter);
export default router;
