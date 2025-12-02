import express from "express";
import validator from "./validator.js";
import controller from "./controller.js";
import { isAdmin } from "../../../middleware/auth.js";
import auth from "../../../middleware/auth.js";
const router = express.Router();

/**
 * @swagger
 * /api/admin/category/addCategory:
 *   post:
 *     summary: Add a new category
 *     tags:
 *       - admin/Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryname:
 *                 type: string
 *                 description: Name of the category
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 categoryName:
 *                   type: string
 *       400:
 *         description: Bad request (missing or invalid categoryName)
 *       500:
 *         description: Internal server error
 */

router.post(
  "/addCategory",
  auth,
  isAdmin,
  validator.addCategory,
  controller.addCategory
);

/**
 * @swagger
 * /api/admin/category/getAllCategory:
 *   get:
 *     tags:
 *       - admin/Category
 *     summary: Get categories by search and date filtering
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
 *         description: Search categories by name (e.g., "electronics", "fashion")
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter categories created on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter categories created on or before this date
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.get("/getAllCategory", auth, controller.getAllCategories);

/**
 * @swagger
 * /api/admin/category/getCategory/{id}:
 *   get:
 *     tags:
 *        - admin/Category
 *     summary: Get an item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to retrieve
 *     responses:
 *       200:
 *         description: Item fetched successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.get("/getCategory/:id", auth, isAdmin, controller.getCategoryId);

/**
 * @swagger
 * /api/admin/category/editCategory/{id}:
 *   patch:
 *     tags:
 *       - admin/Category
 *     summary: Edit category name
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
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

router.patch(
  "/editCategory/:id",
  auth,
  isAdmin,
  validator.addCategory,
  controller.editCategory
);

/**
 * @swagger
 * /api/admin/category/deleteCategory/{id}:
 *   patch:
 *     tags:
 *       - admin/Category
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
router.patch("/deleteCategory/:id", auth, isAdmin, controller.deleteCategory);

/**
 * @swagger
 * /api/admin/category/getCategoryCount:
 *   get:
 *     tags:
 *       - admin/Category
 *     summary: Get total number of categories
 *     responses:
 *       200:
 *         description: Count fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/getCategoryCount", auth, controller.getCategoryCount);

export default router;
