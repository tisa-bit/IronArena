import prisma from "../../../models/prismaClient.js";

const addControlsService = async (data) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category)
      throw new Error(`Category with id ${data.categoryId} not found`);
    if (category.isDeleted)
      throw new Error("Cannot add controls as the category is deleted");

    const control = await prisma.control.create({
      data: {
        controlnumber: data.controlnumber,
        description: data.description,
        tips: data.tips || "",
        controlmapping: data.controlmapping,
        mediaLink: data.mediaLink,
        categoryId: data.categoryId,
        attachmentRequired: data.attachmentRequired,
      },
    });

    return control;
  } catch (error) {
    console.error("Error adding control:", error);
    throw new Error(error.message || "Database error occurred");
  }
};

const getAllControlService = async (data) => {
  // console.log("frontend request", data);
  // console.log("dates from frontend", data.startDate, data.endDate);

  try {
    const { search, startDate, endDate, page = 1, limit = 5 } = data;
    const actualLimit = Number(limit);
    const skip = (Number(page) - 1) * actualLimit;

    const filter = {
      isDeleted: false,
      category: {
        is: { isDeleted: false },
      },
    };

    if (search) {
      filter.description = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.createdAt.gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.lte = end;
      }
    }

    const totalCount = await prisma.control.count({
      where: filter,
    });

    const controls = await prisma.control.findMany({
      where: filter,
      skip,
      take: actualLimit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        description: true,
        tips: true,
        controlmapping: true,
        mediaLink: true,
        controlnumber: true,
        attachmentRequired: true,
        createdAt: true,
        category: {
          select: {
            categoryname: true,
          },
        },
      },
    });

    // console.log("response of filtering ", controls);

    return {
      controls,
      meta: {
        total: totalCount,
        page: Number(page),
        actualLimit,
        totalPages: Math.ceil(totalCount / actualLimit),
      },
    };
  } catch (error) {
    console.error("Error fetching controls:", error);
    throw new Error("Database error occurred while fetching controls");
  }
};

export const getControlIdService = async (id) => {
  try {
    const controlId = Number(id);
    if (isNaN(controlId)) {
      return { error: "Invalid control ID" };
    }

    const control = await prisma.control.findUnique({
      where: { id: controlId },
      select: {
        description: true,
        tips: true,
        controlmapping: true,
        mediaLink: true,
        controlnumber: true,
        attachmentRequired: true,
        category: {
          select: { categoryname: true, isDeleted: true },
        },
      },
    });

    if (!control) {
      return { error: "Control does not exist" };
    }

    return { data: control };
  } catch (error) {
    console.error("Error fetching control by ID:", error);
    return { error: "Database error occurred" };
  }
};

const editControlService = async (id, data) => {
  try {
    const controlId = Number(id);
    if (isNaN(controlId)) {
      throw new Error("Invalid control ID");
    }

    const updatedControl = await prisma.control.update({
      where: {
        id: controlId,
      },
      data: {
        description: data.description,
        tips: data.tips ?? "",
        controlmapping: data.controlmapping ?? "",
        mediaLink: data.mediaLink ?? "",
        categoryId: data.categoryId,
        controlnumber: data.controlnumber,
        attachmentRequired: data.attachmentRequired,
      },
    });

    return updatedControl;
  } catch (error) {
    console.error("Error updating control:", error);
    throw new Error(
      error.message || "Database error occurred while updating control"
    );
  }
};

const deleteControlService = async (Id) => {
  try {
    const controlId = parseInt(Id);
    if (isNaN(controlId)) throw new Error("Invalid control ID");

    const control = await prisma.control.update({
      where: {
        id: controlId,
      },
      data: {
        isDeleted: true,
      },
    });
    return control;
  } catch (error) {
    console.error("Error deleting control:", error);
    throw new Error(
      error.message || "Database error occurred while deleting control"
    );
  }
};

export const getControlCount = async () => {
  try {
    return await prisma.control.count({
      where: { isDeleted: false },
    });
  } catch (error) {
    console.error("Error counting controls:", error);
    throw new Error("Database error occurred while counting controls");
  }
};

export default {
  addControlsService,
  getAllControlService,
  getControlIdService,
  editControlService,
  deleteControlService,
  getControlCount,
};
