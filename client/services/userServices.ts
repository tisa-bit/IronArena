import { Category, Controls, User } from "@/types/types";
import gateway from "./gateway";

// export const fetchControls = async (
//   categoryId: string | number
// ): Promise<Controls[]> => {
//   try {
//     const res = await gateway.get("/users/controls/getAllControls", {
//       params: categoryId ? { categoryId } : {},
//     });
//     return res.data.controls;
//   } catch (err) {
//     console.error("Error fetching categories:", err);
//     return [];
//   }
// };

// export const fetchControlsById = async (
//   id: string
// ): Promise<Controls | null> => {
//   const res = await gateway.get(`/users/controls/getControl/${id}`);
//   return res.data.control;
// };

export const submitAnswers = async (data: FormData) => {
  const res = await gateway.post("/users/controls/submitControls", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

// export const fetchCategories = async (): Promise<Category[]> => {
//   try {
//     const res = await gateway.get("/admin/category/getAllCategory");
//     return res.data.categories;
//   } catch (err) {
//     console.error("Error fetching categories:", err);
//     return [];
//   }
// };

// export const fetchUsersById = async (id: string): Promise<User | null> => {
//   const res = await gateway.get(`/users/profile/getProfile/${id}`);
//   return res.data.data;
// };

// export const editUsers = async (id: number, formData: FormData) => {
//   console.log("hello edit user");

//   const res = await gateway.put("/users/profile/updateUser", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data.data;
// };

export const progress = async (id: number) => {
  const res = await gateway.get(`/users/progress/${id}`);
  return res;
};

export const fetchUserLogs = async (params?: {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await gateway.get("/users/logs/getLogs", { params });
  console.log("user specified", res.data);

  return res.data;
};
