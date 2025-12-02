import express from "express";
import validator from "./validator.js";
import controller from "./controller.js";
import auth from "../../middleware/auth.js";
import { upload } from "../../middleware/multerconfig.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signUp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Add new user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: Firstname of the user
 *               lastname:
 *                 type: string
 *                 description: Lastname of the user
 *               companyname:
 *                 type: string
 *                 description: Company name
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm password
 *               companyLogo:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image
 *     responses:
 *       200:
 *         description: User added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/signUp",
  upload.single("companyLogo"),
  controller.signupController,
  validator.signupValidator
);

/**
 * @swagger
 * /api/auth/emailVerification:
 *   post:
 *     summary: Login step 2 - verify email
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 required: true
 *                 description: Temporary access token
 *               otp:
 *                 type: string
 *                 required: true
 *                 description: 6-digit OTP from authenticator app
 *     responses:
 *        200:
 *          description: OTP verified successfully (returns final token)
 *        400:
 *          description: Invalid or expired OTP
 */
router.post(
  "/emailVerification",
  validator.verifyemail,
  controller.emailVerifyOtp
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user (no 2FA)
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 required: true
 *                 example: 'admin@mailinator.com'
 *               password:
 *                 type: string
 *                 required: true
 *                 example: 'Admin@123'
 *     responses:
 *        200:
 *          description: User logged in successfully
 *        400:
 *          description: Bad request
 *        500:
 *          description: Internal server error
 */
router.post(
  "/login",
  validator.loginValidator,
  controller.loginController
);

// /**
//  * @swagger
//  * /api/auth/2FAAuthenticator:
//  *   post:
//  *     summary: Login step 1 - email/password. If 2FA enabled, returns tempToken (OTP required). If 2FA not enabled, returns final token.
//  *     tags:
//  *       - Auth
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 required: true
//  *                 example: 'admin@mailinator.com'
//  *               password:
//  *                 type: string
//  *                 required: true
//  *                 example: 'Admin@123'
//  *     responses:
//  *        200:
//  *          description: Login step 1 success (returns tempToken if 2FA enabled OR final token if 2FA not enabled)
//  *        400:
//  *          description: Bad request
//  */
// router.post(
//   "/2FAAuthenticator",
//   validator.loginValidator,
//   controller.authenticatorLoginController
// );

/**
 * @swagger
 * /api/auth/2FAverifyotp:
 *   post:
 *     summary: Login step 2 - verify OTP (use when 2FA is enabled)
 *     tags:
 *       - Auth
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 required: true
 *                 description: Temporary access token returned from /2FAAuthenticator
 *               otp:
 *                 type: string
 *                 required: true
 *                 description: 6-digit OTP from authenticator app
 *     responses:
 *        200:
 *          description: OTP verified successfully (returns final token)
 *        400:
 *          description: Invalid or expired OTP
 */
router.post(
  "/2FAverifyotp",
  validator.verifytwofa,
  controller.authenticatorLoginVerifyOtp
);

/**
 * @swagger
 * /api/auth/2fa/setUp:
 *   post:
 *     summary: Generate QR code and secret to setup 2FA (Settings page)
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: QR Code generated successfully (returns qrCode data URL and secret)
 *       401:
 *         description: Unauthorized
 */
router.post("/2fa/setUp", auth, controller.setupTwoFA);

/**
 * @swagger
 * /api/auth/2fa/verifySetup:
 *   post:
 *     summary: Verify OTP and enable 2FA for the logged-in user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *       400:
 *         description: Invalid OTP or setup not initialized
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/2fa/verifySetup",
  auth,
  validator.verifySetupOtp,
  controller.verifyTwoFASetup
);

/**
 * @swagger
 * /api/auth/setPassword:
 *   post:
 *     summary: Set password for invited user
 *     tags:
 *        - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               password:
 *                 type: string
 *                 example: MySecurePass123!
 *             required:
 *               - token
 *               - password
 *     responses:
 *       200:
 *         description: Password set successfully
 */
router.post("/setPassword", controller.setPassword);

/**
 * @swagger
 * /api/auth/changePassword:
 *   put:
 *     summary: Change password (User must be logged in)
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid password
 */

router.put(
  "/changePassword",
  auth,
  validator.changePasswordValidation,
  controller.changePassword
);

/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: Send password reset link to user's email
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       400:
 *         description: Invalid email or other error
 *       500:
 *         description: Internal server error
 */

router.post(
  "/forgotPassword",
  validator.forgotPassword,
  controller.forgotPassword
);

/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token received in the password reset email
 *               newPassword:
 *                 type: string
 *                 description: The new password to set
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/resetPassword",
  validator.validateResetPassword,
  controller.resetPassword
);
export default router;
