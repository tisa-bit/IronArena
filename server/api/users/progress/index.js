import express from "express";
import controller from "./controller.js";
import auth from "../../../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/progress/{id}:
 *   get:
 *     tags:
 *       - users/progress
 *     summary: Get progress statistics for a specific user
 *     description: Returns count of IMPLEMENTED, NOT_IMPLEMENTED and NOT_APPLICABLE answers for the user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 implemented:
 *                   type: integer
 *                   example: 10
 *                 not_implemented:
 *                   type: integer
 *                   example: 5
 *                 not_applicable:
 *                   type: integer
 *                   example: 3
 *                 total:
 *                   type: integer
 *                   example: 18
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get("/:id", auth, controller.getUserProgress);
export default router;
