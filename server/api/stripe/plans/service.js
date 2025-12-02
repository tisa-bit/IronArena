import prisma from "../../../models/prismaClient.js";

const getAllPlansService = async () => {
  
  const plans = await prisma.plan.findMany();
  // console.log("plans", plans);

  return plans;
};

export default { getAllPlansService };
