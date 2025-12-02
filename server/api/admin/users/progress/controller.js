import service from "./service.js";

const getUserProgressForAdmin = async (req, res) => {
  try {
    const progress = await service.getUserProgressForAdmin(req.params.id);
    res.json(progress);
  } catch (error) {
    console.error("Error in getUserProgressForAdmin controller:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch user progress" });
  }
};

export default { getUserProgressForAdmin };
