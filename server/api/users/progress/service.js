import prisma from "../../../models/prismaClient.js";

const getProgress = async (userId) => {
  try {
    const stats = await prisma.answers.groupBy({
      by: ["status"],
      where: { userId: Number(userId) },
      _count: { status: true },
    });

    const formatted = {
      implemented: 0,
      not_implemented: 0,
      not_applicable: 0,
    };

    stats.forEach((row) => {
      formatted[row.status.toLowerCase()] = row._count.status;
    });

    return formatted;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { getProgress };
