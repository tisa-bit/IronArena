import prisma from "../../../models/prismaClient.js";

const getAllControlService = async (data, userId) => {
  try {
    const { categoryId } = data;

    const whereCondition = { isDeleted: false };
    if (categoryId) whereCondition.categoryId = Number(categoryId);

    const controls = await prisma.control.findMany({
      where: whereCondition,
      select: {
        id: true,
        description: true,
        tips: true,
        controlmapping: true,
        mediaLink: true,
        controlnumber: true,
        attachmentRequired: true,
        category: { select: { categoryname: true } },
        answers: {
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });

    return controls;
  } catch (error) {
    console.error("Error fetching all controls:", error);
    throw new Error(error.message || "Failed to fetch controls");
  }
};

const submitControls = async (body, file, userId) => {
  try {
    const { controlId, status, reason } = body;
    const numericControlId = Number(controlId);

    // fetch control meta for logging
    const control = await prisma.control.findUnique({
      where: { id: numericControlId },
      select: {
        description: true,
        controlnumber: true,
      },
    });

    const existingAnswer = await prisma.answers.findFirst({
      where: { userId, controlId: numericControlId },
    });

    let previous = null;
    let current = {
      status,
      reason,
      attachment: file?.filename || null,
    };

    let summaryMessage = "Submitted new control";

    if (existingAnswer) {
      previous = {
        status: existingAnswer.status,
        reason: existingAnswer.reason,
        attachment: existingAnswer.attachment,
      };

      current.attachment = file?.filename || existingAnswer.attachment;
      summaryMessage = summarizeChanges(previous, current);
    }

    let response;
    if (existingAnswer) {
      response = await prisma.answers.update({
        where: { id: existingAnswer.id },
        data: current,
      });
    } else {
      response = await prisma.answers.create({
        data: {
          userId,
          controlId: numericControlId,
          ...current,
        },
      });
    }

    await prisma.log.create({
      data: {
        userId,
        action: summaryMessage,
        details: JSON.stringify({
          controlId: numericControlId,
          controlName: control?.description || `Control ${numericControlId}`,
          previous,
          new: current,
        }),
      },
    });

    return response;
  } catch (error) {
    console.error("Error submitting control:", error);
    throw new Error(error.message || "Failed to submit control");
  }
};

const getAnswers = async () => {
  const stats = await prisma.answers.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  const result = stats.reduce((acc, item) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {});
  return result;
};

const getControlIdService = async (id, userId) => {
  try {
    const controlId = Number(id);
    if (isNaN(controlId)) return { error: "Invalid control ID" };

    const control = await prisma.control.findUnique({
      where: { id: controlId },
      select: {
        id: true,
        description: true,
        tips: true,
        controlmapping: true,
        controlnumber: true,
        attachmentRequired: true,
        category: {
          select: { categoryname: true },
        },
        answers: {
          where: { userId: userId },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });

    if (!control) return { error: "Control does not exist" };

    return { data: control };
  } catch (error) {
    console.error("Error fetching control by ID:", error);
    return { error: "Database error occurred" };
  }
};

function summarizeChanges(previous, current) {
  let changes = [];

  if (previous.status !== current.status) {
    changes.push(`Status changed from ${previous.status} to ${current.status}`);
  }

  if (previous.reason !== current.reason) {
    changes.push("Reason updated");
  }

  if (previous.attachment !== current.attachment) {
    changes.push("Attachment updated");
  }

  return changes.length > 0 ? changes.join(", ") : "No changes";
}

export default {
  getAllControlService,
  submitControls,
  getControlIdService,
  getAnswers,
};
