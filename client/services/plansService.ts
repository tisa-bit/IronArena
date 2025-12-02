import { Plan } from "@/types/types";
import gateway from "./gateway";

export const getPlans = async (): Promise<{ planData: Plan[] }> => {
  const res = await gateway.get("/stripe/plans/getPlans");
  console.log("plans ", res);

  return res.data;
};

export const createsubscription = async (planId: number) => {
  console.log("to backend", planId);

  if (!planId) throw new Error("Plan ID is required");

  const res = await gateway.post(
    "/subscription/savedb/create-checkout-session",
    { planId }
  );

  console.log(res);

  return res;
};

export const fetchTransactions = async (params?: {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  userId?: number;
}) => {
  console.log("params",params);
  
  const res = await gateway.get("/subscription/savedb/getTransactions", {
    params,
  });
  console.log("transaction from backend", res.data);
  return res.data;
};
