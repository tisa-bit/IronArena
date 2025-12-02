import jwt from "jsonwebtoken";
import service from "../api/auth/service.js";
import prisma from "../models/prismaClient.js";

async function verifyToken(req, allowedAudiences = ["loginAccess"]) {
  let token = req.header("Authorization");

  if (!token) {
    throw new Error("Access denied. No token provided.");
  }

  token = token.replace("Bearer ", "");

  const preview = jwt.decode(token);
  if (!preview) throw new Error("Invalid token format.");

  const tokenAudience = preview.aud;

  if (!allowedAudiences.includes(tokenAudience)) {
    throw new Error("Invalid token audience.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: allowedAudiences,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("JWT expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else {
      throw new Error("Token verification failed");
    }
  }

  if (!decoded) {
    throw new Error("Invalid token.");
  }

  req.user = await service.findUserById(decoded.id);

  if (!req.user) {
    throw new Error("Invalid token.");
  }

  if (req.user.Deactivated) {
    throw new Error("Your account is not active.");
  }

  req.token = token;
}

async function auth(req, res, next) {
  try {
    await verifyToken(req, ["loginAccess"]);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

const isAdmin = async (req, res, next) => {
  try {
    await verifyToken(req, ["loginAccess"]);
    if (req.user.role !== "Admin") {
      throw new Error("Access denied. Only admins have access to this.");
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

async function isUser(req, res, next) {
  try {
    await verifyToken(req, ["loginAccess"]);
    if (req.user.role === "Admin") {
      throw new Error("Admins are not allowed to access this.");
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

export async function verify2FAToken(req, res, next) {
  try {
    await verifyToken(req, ["2FA"]);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

export const verifySubscriptionToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: "loginAccess",
    });

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new Error("User not found");

    req.user = user;
    req.user.isSubscribed = decoded.isSubscribed; // optional cache
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

const requireActiveSubscription = async (req, res, next) => {
  try {
    if (
      !req.user ||
      !req.user.isMember ||
      req.user.subscriptionStatus !== "active"
    ) {
      throw new Error("Subscription required to access this resource.");
    }
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: err.message });
  }
};

export default auth;
export { isAdmin, isUser, requireActiveSubscription };
