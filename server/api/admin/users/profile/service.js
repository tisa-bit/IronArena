import prisma from "../../../../models/prismaClient.js";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import path from "path";
import transporter from "../../../../config/nodemailer-config.js";

const addUsersService = async (data) => {
  try {
    const { firstname, lastname, email, companyname } = data;
    if (!firstname || !lastname || !email || !companyname)
      throw new Error("Missing fields");
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist && exist.status === "active")
      throw new Error("User already exists");
    const newUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        companyname,
        email,
        role: "User",
      },
    });

    const inviteToken = jwt.sign(
      { id: newUser.id, email: newUser.email, purpose: "invite" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const payload = {
      email: newUser.email,
      url: `${process.env.FRONTEND_URL}/auth/set-password?token=${inviteToken}`,
      expiryTime: "24 hours",
    };

    const html = await ejs.renderFile(
      path.resolve("modules/template/welcomeMail.ejs"),
      { payload, baseurl: process.env.SERVER_URL }
    );

    const mailOptions = {
      from: process.env.MAILER_FROM,
      to: newUser.email,
      subject: "Set Your Password",
      html,
    };

    await transporter.sendMail(mailOptions);

    return {
      message:
        "Password setting link sent successfully. Please check your email.",
    };
  } catch (error) {
    // console.error("Error adding user:", error);
    throw new Error(
      error.message || "Database error occurred while adding user"
    );
  }
};

const getAllUsersService = async (data, currentUser) => {
  // console.log("data", data);

  try {
    const { search, startDate, endDate, page = 1, limit = 5 } = data;
    const actualLimit = parseInt(limit);
    const skip = (page - 1) * actualLimit;
    const filter = { isDeleted: false };

    if (search) {
      filter.firstname = { contains: search, mode: "insensitive" };
    }

    if (currentUser.role === "Admin") {
      filter.id = { not: currentUser.id };
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.createdAt.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.lte = end;
      }
    }

    const totalCountResult = await prisma.user.count({ where: filter });
    const users = await prisma.user.findMany({
      where: filter,
      skip,
      take: actualLimit,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        companyname: true,
        role: true,
        subscriptionStatus: true,
        createdAt: true,
      },
    });

    // console.log("users", users);

    return {
      users,
      meta: {
        page,
        actualLimit,
        total: totalCountResult,
        totalPages: Math.ceil(totalCountResult / actualLimit),
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Database error occurred while fetching users");
  }
};

export const getUserIdService = async (id) => {
  try {
    const userId = Number(id);
    if (isNaN(userId)) return { error: "Invalid user ID" };

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstname: true,
        lastname: true,
        email: true,
        companyname: true,
        istwoFAEnabled: true,
      },
    });

    if (!user) return { error: "User does not exist" };
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return { error: "Database error occurred" };
  }
};

const deleteUsersService = async (Id) => {
  try {
    const userId = parseInt(Id);
    if (isNaN(userId)) throw new Error("Invalid user ID");
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });
    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Database error occurred while deleting user");
  }
};

export const getUsersCount = async () => {
  try {
    return await prisma.user.count({ where: { isDeleted: false } });
  } catch (error) {
    console.error("Error counting users:", error);
    throw new Error("Database error occurred while counting users");
  }
};

export default {
  addUsersService,
  getAllUsersService,
  getUserIdService,
  deleteUsersService,
  getUsersCount,
};
