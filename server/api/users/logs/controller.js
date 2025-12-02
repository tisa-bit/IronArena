import service from "./service.js";

const getLogsController = async (req, res) => {
  try {
    // Pass the full request object so the service can access req.query and req.user
    const data = await service.getUserLogsService(req);

    return res.json({
      message: "Logs fetched successfully",
      logs: data.logs,
      meta: data.meta,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return res.status(500).json({ message: "Fetching logs failed" });
  }
};

export default { getLogsController };
