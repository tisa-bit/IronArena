import prisma from "../../../models/prismaClient.js";

const getLogsService = async (req) => {
  console.log("logss service");

  try {
    const {
      search = "",
      startDate,
      endDate,
      userId,
      page = 1,
      limit = 5,
      sortField = "createdAt",
      sortOrder = "desc", 
    } = req.query;

    const actualLimit = parseInt(limit);
    const skip = (page - 1) * actualLimit;

    let whereClause = {};

    if (userId) whereClause.userId = Number(userId);

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    if (search) {
      whereClause.OR = [
        { action: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { firstname: { contains: search, mode: "insensitive" } },
              { lastname: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const totalCount = await prisma.log.count({ where: whereClause });

  
    let orderByClause = {};
    if (sortField === "user") {
      
      orderByClause = { user: { firstname: sortOrder } };
    } else if (["action", "createdAt"].includes(sortField)) {
      orderByClause[sortField] = sortOrder;
    } else {
      orderByClause = { createdAt: "desc" }; 
    }

    const logs = await prisma.log.findMany({
      where: whereClause,
      skip,
      take: actualLimit,
      orderBy: orderByClause,
      include: {
        user: { select: { firstname: true, lastname: true, email: true } },
      },
    });

    const formattedLogs = logs.map((log) => {
      let parsedDetails = null;
      try {
        parsedDetails = log.details ? JSON.parse(log.details) : null;
      } catch {}

      let readableMessage = log.action; 

      if (parsedDetails?.controlName) {
        readableMessage = `${log.user?.firstname || ""} ${
          log.user?.lastname || ""
        } updated "${parsedDetails.controlName}" from ${
          parsedDetails?.previous?.status ?? "N/A"
        } → ${parsedDetails?.new?.status ?? "N/A"}`;
      }

      return {
        ...log,
        parsedDetails,
        readableMessage, 
      };
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
    console.error("Admin Log Fetch Failed:", err);
    throw new Error("Failed to fetch logs");
  }
};

export default { getLogsService };
