import express from "express";
import controller from "./controller.js";
import auth, { isAdmin } from "../../../middleware/auth.js";
const router = express.Router();

/**
 * @swagger
 * /api/admin/notifications/getNotification:
 *   get:
 *     tags:
 *       - admin/Notifications
 *     summary: Get notifications by search and date filtering
 *     responses:
 *       200:
 *         description: logs fetched successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get("/getNotification", auth, isAdmin, controller.getNotification);

/**
 * @swagger
 * /api/admin/notifications/markAsRead:
 *   patch:
 *     tags:
 *       - admin/Notifications
 *     summary: mark as read
 *     responses:
 *       200:
 *         description: category updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.put("/markAsRead", auth, controller.markAsRead);
export default router;
