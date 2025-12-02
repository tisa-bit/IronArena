import service from "./service.js";
const addCategory = async (req, res) => {
  try {
    const categoryResponse = await service.addcategoryService(req.body);
    res.status(200).json(categoryResponse);
  } catch (error) {
    res.status(400).json({ message: "category adding failed" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await service.getAllCategoriesService(req.query);
    return res.json({ message: "categories fetched successfully", categories });
  } catch (error) {
    return res.status(500).json({ message: "fetching failed" });
  }
};

const getCategoryId = async (req, res) => {
  try {
    const response = await service.getCategoryIdService(req.params.id);
    return res.status(200).json({
      message: "Fetched category successfully",
      category: response.data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const editCategory = async (req, res) => {
  try {
    const editedCategory = await service.editCategoryService(
      req.params.id,
      req.body
    );
    return res
      .status(200)
      .json({ message: "edited category name", editedCategory });
  } catch (error) {
    return res.status(500).json({ message: "couldn't edit" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await service.deleteCategoryService(req.params.id);
    return res.status(200).json({ message: "deleted category name", category });
  } catch (error) {
    return res.status(500).json({ message: "couldn't delete" });
  }
};

export const getCategoryCount = async (req, res) => {
  try {
    const count = await service.getCategoryCount();
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  addCategory,
  getCategoryId,
  getAllCategories,
  editCategory,
  deleteCategory,
  getCategoryCount,
};
