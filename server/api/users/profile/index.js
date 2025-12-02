import express from "express";
import auth, { isUser } from "../../../middleware/auth.js";
import validator from "./validator.js";
import controller from "./controller.js";
import { upload } from "../../../middleware/multerconfig.js";
const router = express.Router();

/**
 * @swagger
 * /api/users/profile/getProfile/{id}:
 *   get:
 *     tags:
 *       - users/profile
 *     summary: Get logged-in user's profile
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized – Invalid or missing token
 *       500:
 *         description: Internal server error
 */

router.get("/getProfile/:id", auth, controller.getProfile);

/**
 * @swagger
 * /api/users/profile/updateUser:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags:
 *       - users/profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               profilePic:
 *                 type: string
 *                 format: binary
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *           example:
 *             firstname: "John"
 *             lastname: "Doe"
 *             email: "john@example.com"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/updateUser",
  auth,
  isUser,
  upload.single("profilePic"),
  validator.updateProfile,
  controller.updateProfileDetails
);
export default router;
