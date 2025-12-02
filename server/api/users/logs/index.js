import express from "express";
import controller from "./controller.js";
import auth from "../../../middleware/auth.js";

const router = express.Router();
router.get("/getLogs", auth, controller.getLogsController);
export default router;
