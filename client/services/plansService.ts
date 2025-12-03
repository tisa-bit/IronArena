import { Plan } from "@/types/types";
import gateway from "./gateway";

export const getPlans = async (): Promise<{ planData: Plan[] }> => {
  const res = await gateway.get("/stripe/plans/getPlans");
  return res.data;
};

export const createsubscription = async (planId: number) => {
  if (!planId) throw new Error("Plan ID is required");
  const res = await gateway.post(
    "/subscription/savedb/create-checkout-session",
    { planId }
  );
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
  const res = await gateway.get("/subscription/savedb/getTransactions", {
    params,
  });
  return res.data;
};
