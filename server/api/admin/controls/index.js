import express from "express";
import auth, { isAdmin } from "../../../middleware/auth.js";
import validator from "./validator.js";
import controller from "./controller.js";

const router = express.Router();
/**
 * @swagger
 * /api/admin/controls/addControls:
 *   post:
 *     summary: Add a new control
 *     tags:
 *       - admin/Controls
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Title of the control
 *                 example: Risk assessment
 *               tips:
 *                 type: string
 *                 description: Tips for control
 *               controlmapping:
 *                 type: string
 *                 description: Mapping info
 *               mediaLink:
 *                 type: string
 *                 description: Links of audio/video
 *               categoryId:
 *                 type: integer
 *                 description: ID of the corresponding category
 *               controlnumber:
 *                 type: integer
 *                 description: ID of the corresponding control
 *               attachmentRequired:
 *                  type: boolean
 *                  description: File need to be upload or not
 *             required:
 *               - description
 *               - links
 *               - categoryId
 *     responses:
 *       201:
 *         description: Control created successfully
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       500:
 *         description: Internal server error
 */

router.post(
  "/addControls",
  auth,
  isAdmin,
  validator.addControlsValidator,
  controller.addControls
);

/**
 * @swagger
 * /api/admin/controls/getAllControls:
 *   get:
 *     tags:
 *       - admin/Controls
 *     summary: Get controls with pagination, search, and date filtering
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
 *           default: 5
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search controls by description
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter controls created on or after this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter controls created on or before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Items fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/getAllControls", auth, isAdmin, controller.getAllControls);

/**
 * @swagger
 * /api/admin/controls/getControl/{id}:
 *   get:
 *     tags:
 *        - admin/Controls
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

/**
 * @swagger
 * /api/admin/controls/editControl/{id}:
 *   patch:
 *     tags:
 *       - admin/Controls
 *     summary: Edit a control
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Control ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               tips:
 *                 type: string
 *                 example: "Check logs daily"
 *               controlmapping:
 *                 type: string
 *                 example: "NIST 5.2"
 *               mediaLink:
 *                 type: string
 *                 example: "https://example.com/resource.pdf"
 *               controlnumber:
 *                 type: integer
 *                 example: 102
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *               attachmentRequired:
 *                 type: boolean
 *                 description: Whether attachment must be uploaded for IMPLEMENTED
 *                 example: false
 *     responses:
 *       200:
 *         description: Control updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Control not found
 *       500:
 *         description: Internal server error
 */

router.patch(
  "/editControl/:id",
  auth,
  isAdmin,
  validator.addControlsValidator,
  controller.editControl
);

/**
 * @swagger
 * /api/admin/controls/deleteControl/{id}:
 *   patch:
 *     tags:
 *       - admin/Controls
 *     summary: Soft delete or restore an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f5a2d8b2e9f123456789ab"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isDelete:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Item soft deleted successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.patch("/deleteControl/:id", auth, isAdmin, controller.deleteControl);
/**
 * @swagger
 * /api/admin/controls/getControlCount:
 *   get:
 *     tags:
 *       - admin/Controls
 *     summary: Get total number of categories
 *     responses:
 *       200:
 *         description: Count fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/getControlCount", auth, controller.getControlCount);
export default router;
