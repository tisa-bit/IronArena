import express from "express";
import controller from "./controller.js";
import auth, { isAdmin } from "../../../middleware/auth.js";

const router = express.Router();
router.get("/getLogs", auth, isAdmin, controller.getLogsController);
export default router;
