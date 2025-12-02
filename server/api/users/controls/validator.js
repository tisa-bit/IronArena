import prisma from "../../../models/prismaClient.js";

const controlSubmission = async (req, res, next) => {
  try {
    const { controlId, status, reason } = req.body;
    const file = req.file;

    const control = await prisma.control.findUnique({
      where: { id: Number(controlId) },
    });
    if (!control) {
      return res.status(404).json({ message: "Control does not exist" });
    }

    if (status === "IMPLEMENTED") {
      if (control.attachmentRequired && !file) {
        return res.status(400).json({
          message: "PDF attachment is required for IMPLEMENTED controls",
        });
      }
    } else {
      if (!reason || reason.trim() === "") {
        return res.status(400).json({
          message: "Reason is required when control is not implemented",
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Validation failed" });
  }
};

export default { controlSubmission };
