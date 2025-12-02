import prisma from "../models/prismaClient.js";

let ioInstance;

const notificationHandler = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

export const sendAdminNotification = async (message, metadata = {}) => {
  // Save to DB for all admins
  const admins = await prisma.user.findMany({
    where: { role: "Admin" },
    select: { id: true },
  });

  await prisma.notification.create({
    data: {
      message: "User subscribed successfully",
      userId: 1,
      metadata: {
        userId: 20,
        firstname: "John",
      },
    },
  });

  // Emit real-time notification
  if (ioInstance) {
    ioInstance.emit("admin-notification", { message, ...metadata });
  } else {
    console.warn("Socket.io not initialized yet!");
  }
};

export default notificationHandler;
