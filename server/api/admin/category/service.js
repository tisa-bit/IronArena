import prisma from "../../../models/prismaClient.js";

const addcategoryService = async (data) => {
  try {
    const { categoryname } = data;
    if (!categoryname) throw new Error("Category name is required");

    const exsistCategory = await prisma.category.findMany({
      where: { categoryname },
    });

    if (exsistCategory.length > 0) {
      return {
        message: "Category name already exists",
        category: exsistCategory,
      };
    } else {
      const category = await prisma.category.create({
        data: { categoryname },
      });
      return { message: "New category added", category };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to add category" };
  }
};

const getCategoryIdService = async (id) => {
  try {
    const categoryId = Number(id);
    if (isNaN(categoryId)) return { error: "Invalid category ID" };

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) return { error: "Category does not exist" };

    return { data: category };
  } catch (error) {
    console.error(error);
    return { error: "Database error occurred" };
  }
};

const getAllCategoriesService = async (data) => {
  try {
    const { search, startDate, endDate, page = 1, limit = 5 } = data;
    const actuallimit = parseInt(limit);
    const skip = (page - 1) * actuallimit;

    const filter = { isDeleted: false };

    if (search) filter.categoryname = { contains: search, mode: "insensitive" };
    if (startDate)
      filter.createdAt = {
        ...filter.createdAt,
        gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
      };
    if (endDate)
      filter.createdAt = {
        ...filter.createdAt,
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };

    const totalCountResult = await prisma.category.aggregate({
      _count: true,
      where: filter,
    });

    const totalCount = totalCountResult._count;

    const categories = await prisma.category.findMany({
      where: filter,
      select: {
        id: true,
        categoryname: true,
        createdAt: true,
        _count: { select: { controls: true } },
      },
      skip,
      take: actuallimit,
      orderBy: { createdAt: "desc" },
    });

    if (categories.length === 0) throw new Error("No category exists");

    // console.log(categories);
    return {
      categories,
      meta: {
        total: totalCount,
        page,
        actuallimit,
        totalPages: Math.ceil(totalCount / actuallimit),
      },
      message: "Categories fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch categories" };
  }
};

const editCategoryService = async (Id, data) => {
  try {
    const categoryId = parseInt(Id);
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { categoryname: data.categoryname },
    });
    return { message: "Category updated successfully", category };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update category" };
  }
};

const deleteCategoryService = async (Id) => {
  try {
    const categoryId = parseInt(Id);
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { isDeleted: true },
    });
    return { message: "Category deleted successfully", category };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete category" };
  }
};

export const getCategoryCount = async () => {
  try {
    const count = await prisma.category.count({ where: { isDeleted: false } });
    return count;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get category count" };
  }
};

export default {
  addcategoryService,
  getCategoryIdService,
  getAllCategoriesService,
  editCategoryService,
  deleteCategoryService,
  getCategoryCount,
};
