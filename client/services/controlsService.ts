import { Controls, fetchControlResponse } from "@/types/types";
import gateway from "./gateway";

export const addControls = async (data: Controls): Promise<Controls[]> => {
  const res = await gateway.post("/admin/controls/addControls", data);
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

export const fetchControlsUsers = async (
  categoryId: string | number
): Promise<Controls[]> => {
  try {
    const res = await gateway.get("/users/controls/getAllControls", {
      params: categoryId ? { categoryId } : {},
    });
    return res.data.controls;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};

export const totalControl = async () => {
  const res = await gateway.get("/admin/controls/getControlCount");

  return res;
};
