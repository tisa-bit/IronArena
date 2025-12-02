import express from "express";
import controller from "./controller.js";
import validator from "./validator.js";
import auth, { isUser } from "../../../middleware/auth.js";
import { upload } from "../../../middleware/multerconfig.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/controls/getAllControls:
 *   get:
 *     tags:
 *       - users/controls
 *     summary: Get items with pagination, search, sorting, and category filtering
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: number
 *         description: Filter controls by category ID
 *     responses:
 *       200:
 *         description: Items fetched successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.get("/getAllControls", auth, controller.getControls);

/**
 * @swagger
 * /api/users/controls/submitControls:
 *   post:
 *     tags:
 *       - users/controls
 *     summary: Submit a user's response to a control
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               controlId:
 *                 type: number
 *                 example: 12
 *               status:
 *                 type: string
 *                 enum: [IMPLEMENTED, NOT_IMPLEMENTED, NOT_APPLICABLE]
 *                 example: IMPLEMENTED
 *               reason:
 *                 type: string
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Response submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/submitControls",
  auth,
  isUser,
  upload.single("attachment"),
  validator.controlSubmission,
  controller.submitControl
);

/**
 * @swagger
 * /api/users/controls/getControl/{id}:
 *   get:
 *     tags:
 *         - users/controls
 *     summary: Get an controls by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the control to retrieve
 *     responses:
 *       200:
 *         description: control fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.get("/getControl/:id", auth, controller.getControlId);

router.get("/getAnswers",auth,controller.getAnswersController)
export default router;
