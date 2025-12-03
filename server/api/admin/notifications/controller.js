import service from "./service.js";
const getNotification = async (req, res) => {
  try {
    const notifications = await service.getNotificationsService();
    return res.json({
      messsage: "notification fetched success",
      notifications,
    });
  } catch (error) {
    return res.json({ messsage: "fetching failed" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const data = await service.readService(req.body.ids);
    return res.json({ message: "marked as read", data });
  } catch {
    return res.json({ messsage: "failed" });
  }
};
export default { getNotification, markAsRead };
