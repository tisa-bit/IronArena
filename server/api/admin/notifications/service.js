import prisma from "../../../models/prismaClient.js";

const getNotificationsService = async () => {
  const notifications = await prisma.notification.findMany();
  return notifications;
};

export default { getNotificationsService };
