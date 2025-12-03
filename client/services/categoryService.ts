import { Category, fetchCategoriesResponse } from "@/types/types";
import gateway from "./gateway";

export const addCategories = async (data: Category): Promise<Category[]> => {
  try {
    const res = await gateway.post("/admin/category/addCategory", data);
    return res.data;
  } catch (err) {
    return [];
  }
};

export const fetchCategories = async (
  search: string = "",
  startDate?: string,
  endDate?: string,
  page: number = 1,
  limit: number = 5
): Promise<fetchCategoriesResponse> => {
  const res = await gateway.get("/admin/category/getAllCategory", {
    params: { search, startDate, endDate, page, limit },
  });
  return res.data.categories;
};

export const fetchCategoryById = async (
  id: string
): Promise<Category | null> => {
  try {
    const res = await gateway.get(`/admin/category/getCategory/${id}`);
    return res.data.category;
  } catch (err) {
    return null;
  }
};

export const editCategories = async (id: number, data: Partial<Category>) => {
  const res = await gateway.patch(`/admin/category/editCategory/${id}`, data);
  return res.data;
};
export const deleteCategory = async (id: number) => {
  const res = await gateway.patch(`/admin/category/deleteCategory/${id}`);
  return res.data;
};

export const totalCategories = async () => {
  const res = await gateway.get("/admin/category/getCategoryCount");

  return res;
};
