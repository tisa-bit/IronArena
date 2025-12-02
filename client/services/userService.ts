import { fetchUserResponse, User } from "@/types/types";
import gateway from "./gateway";

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

export const fetchUsersByIdUser = async (id: string): Promise<User | null> => {
  const res = await gateway.get(`/users/profile/getProfile/${id}`);
  return res.data.data;
};
export const deleteUser = async (id: number) => {
  const res = await gateway.patch(`/admin/usersList/profile/deleteUsers/${id}`);
  return res.data;
};

export const editUsers = async (id: number, formData: FormData) => {
  console.log("hello edit user");

  const res = await gateway.put("/users/profile/updateUser", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const totalUsers = async () => {
  const res = await gateway.get("/admin/usersList/profile/getUsersCount");
  return res;
};
