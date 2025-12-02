import express from "express";
import controller from "./controller.js";
import auth, { isAdmin } from "../../../middleware/auth.js";
const router = express.Router();

router.get("/getNotification", auth, isAdmin, controller.getNotification);
export default router;
