import service from "./service.js";
const addControls = async (req, res) => {
  try {
    const controls = await service.addControlsService(req.body);
    return res
      .status(200)
      .json({ message: "controls added sucesfully", controls });
  } catch (error) {
    return res.status(500).json({ message: "failed" });
  }
};

const getAllControls = async (req, res) => {
  try {
    const controls = await service.getAllControlService(req.query);
   

    return res.json({ message: "controls fetched successfully", ...controls });
  } catch (error) {
    return res.status(500).json({ message: "fetching failed" });
  }
};

const getControlId = async (req, res) => {
  try {
    const response = await service.getControlIdService(req.params.id);
    return res.status(200).json({
      message: "Fetched category successfully",
      control: response.data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const editControl = async (req, res) => {
  try {
    const editedCategory = await service.editControlService(
      req.params.id,
      req.body
    );
    return res
      .status(200)
      .json({ message: "edited category name", editedCategory });
  } catch (error) {
    return res.status(500).json({ message: "couldn't edit" });
  }
};

const deleteControl = async (req, res) => {
  try {
    const category = await service.deleteControlService(req.params.id);
    return res.status(200).json({ message: "deleted category name", category });
  } catch (error) {
    return res.status(500).json({ message: "couldn't delete" });
  }
};

export const getControlCount = async (req, res) => {
  try {
    const count = await service.getControlCount();
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export default {
  addControls,
  getAllControls,
  getControlId,
  editControl,
  deleteControl,
  getControlCount,
};
