import prisma from "../../../models/prismaClient.js";

const getNotificationsService = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        isRead: false,
      },
    });
    return notifications;
  } catch (error) {
    throw new Error("fetching failed");
  }
};

const readService = async (data) => {
  const isRead = await prisma.notification.updateMany({
    where: { id: { in: data } },
    data: { isRead: true },
  });

  return isRead;
};

export default { getNotificationsService, readService };
