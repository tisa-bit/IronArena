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

export default { getNotification };
