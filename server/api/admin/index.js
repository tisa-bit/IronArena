import express from "express";
import categoryRoute from "./category/index.js";
import controlsRoute from "./controls/index.js";
import usersRoute from "./users/index.js";
import reportRouter from "./report/index.js";
import logsRouter from "./logs/index.js";
const router = express.Router();

router.use("/category", categoryRoute);
router.use("/controls", controlsRoute);
router.use("/usersList", usersRoute);
router.use("/report", reportRouter);
router.use("/logs", logsRouter);
export default router;
