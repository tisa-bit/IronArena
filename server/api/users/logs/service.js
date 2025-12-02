import prisma from "../../../models/prismaClient.js";

const getUserLogsService = async (req) => {
  try {
    const { search = "", startDate, endDate, page = 1, limit = 5 } = req.query;

    // Logged-in user
    const userId = req.user.id;

    const actualLimit = parseInt(limit);
    const skip = (page - 1) * actualLimit;

    // Build where clause: only the user's logs
    let whereClause = { userId };

    // Date filter
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    // Search by action
    if (search) {
      whereClause.action = { contains: search, mode: "insensitive" };
    }

    // Total logs count
    const totalCount = await prisma.log.count({ where: whereClause });

    // Fetch logs
    const logs = await prisma.log.findMany({
      where: whereClause,
      skip,
      take: actualLimit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { firstname: true, lastname: true, email: true },
        },
      },
    });

    // Format logs for the user
    const formattedLogs = logs.map((log) => {
      let parsedDetails = null;
      try {
        parsedDetails = log.details ? JSON.parse(log.details) : null;
      } catch {}

      // Always safe: first-person for the user
      let readableMessage = log.action;
      if (parsedDetails?.controlName) {
        readableMessage = `You updated "${parsedDetails.controlName}" from ${
          parsedDetails?.previous?.status ?? "N/A"
        } → ${parsedDetails?.new?.status ?? "N/A"}`;
      }

      return { ...log, parsedDetails, readableMessage };
    });

    return {
      logs: formattedLogs,
      meta: {
        total: totalCount,
        page: Number(page),
        limit: actualLimit,
        totalPages: Math.ceil(totalCount / actualLimit),
      },
    };
  } catch (err) {
    console.error("User log fetch failed:", err);
    throw new Error("Failed to fetch user logs");
  }
};

export default { getUserLogsService };
