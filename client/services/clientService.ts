import gateway from "./gateway";

export const submitAnswers = async (data: FormData) => {
  const res = await gateway.post("/users/controls/submitControls", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

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
