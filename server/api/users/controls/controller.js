import service from "./service.js";

const getControls = async (req, res) => {
  try {
    const controls = await service.getAllControlService(req.query, req.user.id);
    return res
      .status(200)
      .json({ message: "controls fetched succesfully", controls });
  } catch (err) {
    return res.status(500).json({ message: "fetching failed" });
  }
};

const submitControl = async (req, res) => {
  try {
    const data = await service.submitControls(req.body, req.file, req.user.id);
    return res.status(200).json({
      message: "Answer submitted successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const getControlId = async (req, res) => {
  try {
    const response = await service.getControlIdService(
      req.params.id,
      req.user.id
    );
    return res.status(200).json({
      message: "Fetched category successfully",
      control: response.data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export default {
  getControls,
  submitControl,
  getControlId,
  
};
