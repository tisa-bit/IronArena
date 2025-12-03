import express from "express";
import controller from "./controller.js";
import auth, { isAdmin } from "../../../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/logs/getLogs:
 *   get:
 *     tags:
 *       - admin/Logs
 *     summary: Get logs by search and date filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search logs by name 
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs created on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs created on or before this date
 *     responses:
 *       200:
 *         description: logs fetched successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.get("/getLogs", auth, isAdmin, controller.getLogsController);
export default router;
