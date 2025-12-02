import service from "./service.js";
const getLogsController = async (req, res) => {
  try {
    const data = await service.getLogsService(req);
    return res.json({ message: "logs fetched", data });
  } catch (error) {
    return res.json({ message: "fetching logs failed" });
  }
};

export default { getLogsController };
