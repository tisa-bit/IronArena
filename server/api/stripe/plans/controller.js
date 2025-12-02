import service from "./service.js";
const getPlans = async (req, res) => {
  try {
    const planData = await service.getAllPlansService();
    return res.json({ message: "plan fetched succcessfully", planData });
  } catch (err) {
    return res.json({ message: "fetching failed", err });
  }
};

export default { getPlans };
