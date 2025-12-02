import express from "express";
import controller from "./controller.js";
import auth from "../../../middleware/auth.js";
const router = express.Router();

router.get("/getPlans", auth, controller.getPlans);
export default router;
