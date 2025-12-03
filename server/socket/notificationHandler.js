import prisma from "../models/prismaClient.js";

let ioInstance;

const notificationHandler = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const sendAdminNotification = async (message, metadata = {}) => {
  const { firstname, lastname } = metadata;
  const fullMessage = `${firstname} ${lastname} ${message}`;

  const admins = await prisma.user.findMany({ where: { role: "Admin" } });

  for (const admin of admins) {
    await prisma.notification.create({
      data: {
        message: fullMessage,
        metadata,
        userId: admin.id,
      },
    });
  }

  if (ioInstance)
    ioInstance.emit("admin-notification", {
      message: fullMessage,
      metadata,
    });
};

export default notificationHandler;
