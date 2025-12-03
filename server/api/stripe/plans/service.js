import prisma from "../../../models/prismaClient.js";

const getAllPlansService = async () => {
  const plans = await prisma.plan.findMany();
  return plans;
};

export default { getAllPlansService };
