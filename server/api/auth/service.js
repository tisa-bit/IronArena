import jwt from "jsonwebtoken";
import prisma from "../../models/prismaClient.js";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import ejs from "ejs";
import path from "path";
import transporter from "../../config/nodemailer-config.js";

const findUserById = async (id) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw new Error("Failed to find user");
  }
};

export const generateQRCode = async (secret) => {
  try {
    return await QRCode.toDataURL(secret.otpauth_url);
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const signupService = async (data) => {
  if (!data.firstname || !data.lastname || !data.email || !data.password)
    throw new Error("Missing required fields");

  const exist = await prisma.user.findUnique({ where: { email: data.email } });
  if (exist) throw new Error("Email already exists");
  if (data.password !== data.confirmPassword)
    throw new Error("Passwords do not match");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const otp = crypto.randomInt(100000, 999999);
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const newUser = await prisma.user.create({
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
      companyname: data.companyname,
      companyLogo: data.companyLogo || null,
      emailotp: otp,
      otpExpiry,
      status: "pending",
    },
  });

  const html = await ejs.renderFile(
    path.resolve("modules/template/welcomeEmail.ejs"),
    { baseurl: process.env.SERVER_URL, otp, expiryTime: otpExpiry }
  );

  await transporter.sendMail({
    from: process.env.MAILER_FROM,
    to: newUser.email,
    subject: "Verify Email",
    html,
  });

  const tempToken = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { newUser, tempToken };
};

const emailverificationOtp = async (tempToken, otp) => {
  // console.log("otp", otp);

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new Error("user doesnt exsist");

    if (String(user.emailotp).trim() !== String(otp).trim()) {
      throw new Error("otp verification failed");
    }

    if (Date.now() > new Date(user.otpExpiry).getTime()) {
      throw new BadRequest("OTP expired", "OTP_EXPIRED");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { status: "active", emailotp: null },
    });

    const admins = await prisma.user.findMany({
      where: { role: "Admin" },
      select: { email: true },
    });

    const adminEmails = admins.map((a) => a.email);

    const html = await ejs.renderFile(
      path.resolve("modules/template/userSignup.ejs"),
      { baseurl: process.env.SERVER_URL }
    );

    await transporter.sendMail({
      from: process.env.MAILER_FROM,
      to: adminEmails,
      subject: "new user registered",
      html,
    });

    const finalToken = await generateToken(user, "otpverification");
    return { token: { accessToken: finalToken }, updatedUser };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error(error.message || "Failed to verify OTP");
  }
};

export const loginService = async ({ email, password }) => {
  try {
    if (!email || !password) throw new Error("Email & Password required");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const tokenObj = await generateToken(user, "login");

    if (user.istwoFAEnabled) {
      const tempToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h", audience: "2FA" }
      );
      return { tempToken, user };
    }

    if (user.role !== "Admin") {
      const activeSub = await prisma.subscription.findFirst({
        where: { userId: user.id, status: "active" },
      });

      if (!activeSub) {
        return {
          user,
          token: tokenObj,
          success: false,
          type: "not_subscribed",
          message: "Access denied. Please subscribe to access this content.",
        };
      }
    }

    return { user, token: tokenObj, success: true };
  } catch (error) {
    console.error("Error in loginService:", error);

    if (!error.type) {
      if (error.message.includes("credentials"))
        error.type = "invalid_credentials";
      else if (error.message.includes("not found"))
        error.type = "user_not_found";
      else error.type = "general";
    }

    throw error;
  }
};

// Token generator
export const generateToken = async (user, type) => {
  try {
    const tokenExpiry = "30d";
    if (type === "login" || type === "otpverification") {
      const loginAccess = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
          isSubscribed: user.isMember,
        },
        process.env.JWT_SECRET,
        { expiresIn: tokenExpiry, audience: "loginAccess" }
      );
      return { accessToken: loginAccess };
    }
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};

// const authenticatorLoginService = async ({ email, password }) => {
//   try {
//     if (!email || !password) throw new Error("Email & Password required");

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) throw new Error("User not found");

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) throw new Error("Invalid credentials");

//     if (user.istwoFAEnabled) {
//       const tempToken = jwt.sign(
//         { id: user.id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );
//       return { tempToken };
//     }

//     const tokenObj = await generateToken(user, "login");
//     return { token: tokenObj, user };
//   } catch (error) {
//     console.error("Error in authenticatorLoginService:", error);
//     throw error;
//   }
// };

const authenticatorVerifyOtp = async (tempToken, otp) => {
  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || !user.istwoFAEnabled) throw new Error("2FA not enabled");

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!verified) throw new Error("Invalid OTP");

    const finalToken = jwt.sign(
      { id: user.id, email: user.email, roleId: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d", audience: "loginAccess" }
    );

    return { token: { accessToken: finalToken }, user };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error(error.message || "Failed to verify OTP");
  }
};

const setupTwoFAService = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) throw new Error("User not found");

    if (user.istwoFAEnabled) {
      return { message: "2FA already enabled" };
    }

    const newSecret = speakeasy.generateSecret({
      name: `MyApp(${user.email})`,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFASecret: newSecret.base32, istwoFAEnabled: false },
    });

    const qrCode = await QRCode.toDataURL(newSecret.otpauth_url);
    return { secret: newSecret.base32, qrCode };
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    throw new Error(error.message || "Failed to setup 2FA");
  }
};

const verifyTwoFASetupService = async (userId, otp) => {
  try {
    const user = await findUserById(userId);
    if (!user || !user.twoFASecret)
      throw new Error("2FA setup not initialized");

    if (user.istwoFAEnabled) throw new Error("2FA already enabled");

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!verified) throw new Error("Invalid OTP");

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { istwoFAEnabled: true },
    });

    await prisma.log.create({
      data: { userId: userId, action: "enabled twofa authentication" },
    });
    return { success: true, user: updated };
  } catch (error) {
    console.error("Error verifying 2FA setup:", error);
    throw new Error(error.message || "Failed to verify 2FA setup");
  }
};

const setPasswordService = async (token, newPassword) => {
  try {
    if (!token || !newPassword) throw new Error("Missing required fields");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.purpose !== "invite") throw new Error("Invalid token");

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new Error("User not found");
    if (user.password) throw new Error("Password already set");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, status: "active" },
    });

    const tempToken = await generateToken(updatedUser, "subscribe");

    return { user: updatedUser, tempToken };
  } catch (error) {
    console.error("Error setting password:", error);
    throw new Error(error.message || "Failed to set password");
  }
};

const updatePassword = async (userId, data) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const isOldCorrect = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!isOldCorrect) throw new Error("Current password is incorrect");

    if (data.currentPassword === data.newPassword)
      throw new Error("New password cannot be the same as the old password");

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    return await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error(error.message || "Failed to update password");
  }
};

const forgotPassword = async (data) => {
  try {
    const { email } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "20m",
      }
    );

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    const html = await ejs.renderFile(
      path.resolve("modules/template/forgotPasswordEmail.ejs"),
      { name: user.firstname, resetLink }
    );

    await transporter.sendMail({
      from: process.env.MAILER_FROM,
      to: user.email,
      subject: "Password Reset Request",
      html,
    });

    await prisma.log.create({
      data: {
        userId: user.id,
        action: "controls submitted",
      },
    });
    return {
      message:
        "Password reset link sent successfully. Please check your email.",
    };
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    throw new Error(error.message || "Failed to send password reset link");
  }
};

const resetPasswordService = async (data) => {
  try {
    const { token, newPassword } = data;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) throw new Error("User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    const tempToken = await generateToken(updatedUser, "login");

    console.log("tempToken", tempToken);

    return { tempToken, updatedUser };
  } catch (err) {
    console.error("Error in resetPasswordService:", err);
    if (err.name === "TokenExpiredError")
      throw new Error("Reset token has expired");
    if (err.name === "JsonWebTokenError")
      throw new Error("Invalid reset token");
    throw err;
  }
};

export default {
  signupService,
  emailverificationOtp,
  loginService,
  generateToken,
  findUserById,
  authenticatorVerifyOtp,

  setupTwoFAService,
  verifyTwoFASetupService,
  setPasswordService,
  updatePassword,
  forgotPassword,
  resetPasswordService,
};
