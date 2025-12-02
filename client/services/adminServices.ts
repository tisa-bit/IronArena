import {
  Category,
  Controls,
  fetchCategoriesResponse,
  fetchControlResponse,
  fetchUserResponse,
  User,
} from "@/types/types";
import gateway from "./gateway";

export const addCategories = async (data: Category): Promise<Category[]> => {
  try {
    const res = await gateway.post("/admin/category/addCategory", data);
    return res.data;
  } catch (err) {
    console.error("Error adding category:", err);
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
    console.error("Error fetching category:", err);
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

export const fetchControls = async (
  search: string = "",
  start?: string,
  end?: string,
  page: number = 1,
  limit: number = 5
): Promise<fetchControlResponse> => {
  const res = await gateway.get("/admin/controls/getAllControls", {
    params: { search, startDate: start, endDate: end, page, limit },
  });
  console.log(res.data);
  return res.data;
};

export const addControls = async (data: Controls): Promise<Controls[]> => {
  const res = await gateway.post("/admin/controls/addControls", data);
  return res.data;
};

export const fetchControlsById = async (
  id: string
): Promise<Controls | null> => {
  const res = await gateway.get(`/admin/controls/getControl/${id}`);
  return res.data.control;
};

export const editControls = async (id: number, data: Partial<Controls>) => {
  const res = await gateway.patch(`admin/controls/editControl/${id}`, data);
  return res.data;
};

export const deleteControl = async (id: number) => {
  const res = await gateway.patch(`/admin/controls/deleteControl/${id}`);
  return res.data;
};

export const addUsers = async (formData: FormData) => {
  console.log("add users");

  const res = await gateway.post("admin/usersList/profile/addUsers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const fetchUsers = async (
  search: string = "",
  startDate?: string,
  endDate?: string,
  page: number = 1,
  limit: number = 5
): Promise<fetchUserResponse> => {
  const res = await gateway.get("/admin/usersList/profile/getAllUsers", {
    params: { search, startDate, endDate, page, limit },
  });
  console.log("userslist", res.data.users);

  return res.data;
};

export const fetchUsersById = async (id: string): Promise<User | null> => {
  const res = await gateway.get(`/admin/usersList/profile/getUsers/${id}`);
  console.log("single user", res.data.response);

  return res.data.response;
};

export const deleteUser = async (id: number) => {
  const res = await gateway.patch(`/admin/usersList/profile/deleteUsers/${id}`);
  return res.data;
};

export const totalControl = async () => {
  const res = await gateway.get("/admin/controls/getControlCount");

  return res;
};

export const totalCategories = async () => {
  const res = await gateway.get("/admin/category/getCategoryCount");

  return res;
};
export const totalUsers = async () => {
  const res = await gateway.get("/admin/usersList/profile/getUsersCount");

  return res;
};

export const progress = async (id: number) => {
  const res = await gateway.get(`/admin/usersList/progress/${id}`);
  return res;
};

export const getPdfResponse = async (id: number) => {
  const res = await gateway.get(`/admin/report/getReport/${id}`);
  console.log("from backend", res.data.report);
  return res.data.report;
};

export const downloadPdf = async (data) => {
  try {
    const res = await gateway.post(`/admin/report/generatePDf`, data, {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${data.user.firstname}_report.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    console.error("PDF download failed:", error);
    return false;
  }
};

// For admin logs
export const fetchAdminLogs = async (params?: {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  userId?: number;
}) => {
 
  
  const res = await gateway.get("/admin/logs/getLogs", { params });
  console.log(res.data.data);
  
  return res.data.data;
};
