import prisma from "../../../../models/prismaClient.js";

const getUserProgressForAdmin = async (userId) => {
  const numericId = Number(userId);
  try {
    if (!userId) throw new Error("Invalid user ID");

    const grouped = await prisma.answers.groupBy({
      by: ["status"],
      where: { userId: numericId },
      _count: {
        status: true,
      },
    });

    let implemented = 0,
      notImplemented = 0,
      notApplicable = 0;

    grouped.forEach((item) => {
      switch (item.status) {
        case "IMPLEMENTED":
          implemented = item._count.status;
          break;
        case "NOT_IMPLEMENTED":
          notImplemented = item._count.status;
          break;
        case "NOT_APPLICABLE":
          notApplicable = item._count.status;
          break;
      }
    });

    const total = implemented + notImplemented + notApplicable;

    return { implemented, notImplemented, notApplicable, total };
  } catch (err) {
    console.error("Error fetching user progress:", err);
    throw new Error(err.message || "Failed to fetch user progress");
  }
};

export default { getUserProgressForAdmin };
