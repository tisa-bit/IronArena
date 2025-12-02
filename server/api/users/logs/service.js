import prisma from "../../../models/prismaClient.js";

const getLogsService = async (req) => {
  try {
    const {
      search = "",
      startDate,
      endDate,
      userId,
      page = 1,
      limit = 5,
    } = req.query;

    const requester = req.user;

    const actuallimit = parseInt(limit);
    const skip = (page - 1) * actuallimit;

    let whereClause = {};

    if (requester.role === "Admin") {
      if (userId) {
        whereClause.userId = Number(userId);
      }
    } else {
      whereClause.userId = requester.id;
    }

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

    const logs = await prisma.log.findMany({
      where: whereClause,
      skip,
      take: actuallimit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { firstname: true, lastname: true, email: true },
        },
      },
    });

    const formattedLogs = logs.map((log) => {
      let parsedDetails = null;

      try {
        parsedDetails = log.details ? JSON.parse(log.details) : null;
      } catch {}

      let readableMessage = `${log.user?.firstname || ""} ${
        log.user?.lastname || ""
      } ${log.action}`;

      if (parsedDetails?.controlName) {
        readableMessage = `${log.user?.firstname || ""} ${
          log.user?.lastname || ""
        } updated "${parsedDetails.controlName}" from ${
          parsedDetails?.previous?.status ?? "N/A"
        } → ${parsedDetails?.new?.status ?? "N/A"}`;
      }

      // console.log("Returning Log:", {
      //   ...log,
      //   parsedDetails,
      //   readableMessage,
      // });

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
        limit: actuallimit,
        totalPages: Math.ceil(totalCount / actuallimit),
      },
    };
  } catch (err) {
    console.error("Log Fetch Failed:", err);
    throw new Error("Failed to fetch logs");
  }
};

export default { getLogsService };
