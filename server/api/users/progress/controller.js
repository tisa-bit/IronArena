import service from "./service.js";

const getUserProgress = async (req, res) => {
  try {
    const data = await service.getProgress(req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching progress" });
  }
};

export default {
  getUserProgress,
};
