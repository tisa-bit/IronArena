import service from "./service.js";

const getProfile = async (req, res, next) => {
  try {
    const data = await service.getUserProfile(req.user.id);
    return res.json({ message: "User fetched successfully", data });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch user profile" });
  }
};

const updateProfileDetails = async (req, res, next) => {
  try {
    const updatedUser = await service.updateUserProfile(
      req.user.id,
      req.body,
      req.file
    );
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to update user profile" });
  }
};

export default { getProfile, updateProfileDetails };
