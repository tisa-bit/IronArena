import express from "express";
import validator from "./validator.js";
import controller from "./controller.js";
import auth, { isAdmin } from "../../../../middleware/auth.js";
import { upload } from "../../../../middleware/multerconfig.js";

const router = express.Router();
/**
 * @swagger
 * /api/admin/usersList/profile/addUsers:
 *   post:
 *     summary: Add a new user (send invitation email)
 *     tags:
 *       - admin/usersList
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: User's first name
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: User's last name
 *                 example: Doe
 *               companyname:
 *                 type: string
 *                 description: Company name of user
 *                 example: Acme Corp
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user to send invite
 *                 example: john.doe@example.com
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *     responses:
 *       201:
 *         description: User created and invitation email sent successfully
 *       400:
 *         description: Bad request — missing or invalid fields
 *       409:
 *         description: User already exists with this email
 *       500:
 *         description: Internal server error
 */

router.post(
  "/addUsers",
  auth,
  isAdmin,
  upload.single("profilePic"),
  validator.addUsers,
  controller.addUsers
);

/**
 * @swagger
 * /api/admin/usersList/profile/getAllUsers:
 *   get:
 *     tags:
 *       - admin/usersList
 *     summary: Get items with pagination, search, sorting, and category filtering
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search categories by name (e.g., "electronics", "fashion")
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         description: Filter categories created on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *         description: Filter categories created on or before this date
 *     responses:
 *       200:
 *         description: Items fetched successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.get("/getAllUsers", auth, isAdmin, controller.getAllUsers);

/**
 * @swagger
 * /api/admin/usersList/profile/getUsers/{id}:
 *   get:
 *     tags:
 *        - admin/usersList
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
router.get("/getUsers/:id", auth, isAdmin, controller.getUsersId);

/**
 * @swagger
 * /api/admin/usersList/profile/deleteUsers/{id}:
 *   patch:
 *     tags:
 *       - admin/usersList
 *     summary: Soft delete or restore an item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
router.patch("/deleteUsers/:id", auth, isAdmin, controller.deleteUsers);

/**
 * @swagger
 * /api/admin/usersList/profile/getUsersCount:
 *   get:
 *     tags:
 *       - admin/usersList
 *     summary: Get total number of categories
 *     responses:
 *       200:
 *         description: Count fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/getUsersCount", auth, controller.getUsersCount);
export default router;
