import express from "express";
import auth, { isAdmin } from "../../../../middleware/auth.js";
import controller from "./controller.js";
const router = express.Router();

router.get("/:id", auth, isAdmin, controller.getReport);
export default router;
