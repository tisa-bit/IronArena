import service from "./service.js";
const addUsers = async (req, res) => {
  try {
    const usersData = await service.addUsersService(req.body);
    return res.status(200).json({ message: "user addedd", usersData });
  } catch (error) {
    return res.status(500).json({ message: "failed" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await service.getAllUsersService(req.query, req.user);
    return res.json({
      message: "users fetched successfully",
      ...response,
    });
  } catch (error) {
  
    return res.status(500).json({ message: "fetching failed" });
  }
};

const getUsersId = async (req, res) => {
  try {
    const response = await service.getUserIdService(req.params.id);
    return res.status(200).json({
      message: "Fetched category successfully",
      response,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const users = await service.deleteUsersService(req.params.id);
    return res.status(200).json({ message: "deleted user", users });
  } catch (error) {
    return res.status(500).json({ message: "couldn't delete" });
  }
};

export const getUsersCount = async (req, res) => {
  try {
    const count = await service.getUsersCount();
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export default {
  addUsers,
  getAllUsers,
  getUsersId,
  deleteUsers,
  getUsersCount,
};
