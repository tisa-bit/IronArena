import express from "express";
import controller from "./controller.js";
import auth from "../../../middleware/auth.js";
import bodyParser from "body-parser";
const router = express.Router();
router.get("/getReport/:id", auth, controller.getReportController);
// router.use(bodyParser.json({ limit: "5mb" }));
router.post("/generatePDf", auth, controller.generatePdfController);
export default router;
