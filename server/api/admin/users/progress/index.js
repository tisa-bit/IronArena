import express from "express";
import controller from "./controller.js";
import auth, { isAdmin } from "../../../../middleware/auth.js";
const router = express.Router();

/**
 * @swagger
 * /api/admin/usersList/progress/{id}:
 *   get:
 *     tags:
 *       - admin/usersList
 *     summary: Get progress statistics for a specific user
 *     description: Returns count of IMPLEMENTED, NOT_IMPLEMENTED, and NOT_APPLICABLE answers for the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *           example: 5
 *     security:
 *       - bearerAuth: []   # Assuming you use bearer token auth
 *     responses:
 *       200:
 *         description: Progress summary for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 implemented:
 *                   type: integer
 *                   example: 10
 *                 notImplemented:
 *                   type: integer
 *                   example: 5
 *                 notApplicable:
 *                   type: integer
 *                   example: 3
 *                 total:
 *                   type: integer
 *                   example: 18
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (if user is not admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get("/:id", auth, isAdmin, controller.getUserProgressForAdmin);
export default router;
