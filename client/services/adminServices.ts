import gateway from "./gateway";

export const progress = async (id: number) => {
  const res = await gateway.get(`/admin/usersList/progress/${id}`);
  return res;
};

export const getPdfResponse = async (id: number) => {
  const res = await gateway.get(`/admin/report/getReport/${id}`);
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
    return error;
  }
};

export const fetchAdminLogs = async (params?: {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  userId?: number;
}) => {
  const res = await gateway.get("/admin/logs/getLogs", { params });
  return res.data.data;
};

export const fetchNotifications = async () => {
  const res = await gateway.get("/admin/notifications/getNotification");
  return res.data.notifications;
};

export const markNotificationsUnread = async (ids: string[]) => {
  const res = await gateway.put("/admin/notifications/markAsRead", { ids });
  return res.data;
};
