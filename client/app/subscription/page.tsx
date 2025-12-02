"use client";

import { useEffect, useState } from "react";
import Card from "@/components/common/Cards";
import Modal from "@/components/common/Modal";
import { createsubscription, getPlans } from "@/services/plansService";
import { Plan } from "@/types/types";
import { useRouter } from "next/navigation";
import { useAuthStorage } from "@/hooks/useAuthStorage";

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const router = useRouter();
  const { getAccessToken } = useAuthStorage();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlans();
        setPlans(res.planData);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: Plan) => setSelectedPlan(plan);

  const handleSubscribe = async () => {
    if (!selectedPlan) return alert("Please select a plan");

    try {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Session expired. Please login again.");

      const res = await createsubscription(selectedPlan.id, accessToken);
      console.log("subscription frontend", res.data.data);

      if (res?.data?.data?.url) {
        window.location.href = res.data.data.url; // redirect to Stripe
      }
    } catch (err: any) {
      console.error("Subscription failed:", err);
      alert(err.message || "Subscription failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-rose-400 z-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Choose a Plan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} title={plan.name}>
              <p className="text-gray-800 mb-2">{plan.plandescription}</p>
              <p className="text-gray-900 font-semibold mb-2">
                {plan.amount / 100} {plan.currency.toUpperCase()}
              </p>
              <button
                onClick={() => handleSelectPlan(plan)}
                className="px-4 py-2 rounded-full bg-rose-500 text-white hover:opacity-90 transition-all mt-2"
              >
                Select
              </button>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)}>
        <h2 className="text-xl font-semibold mb-4">{selectedPlan?.name}</h2>
        <p className="mb-4">{selectedPlan?.plandescription}</p>
        <p className="mb-4 font-semibold">
          Price: {selectedPlan?.amount / 100}{" "}
          {selectedPlan?.currency.toUpperCase()}
        </p>
        <button
          onClick={handleSubscribe}
          className="w-full py-2 rounded-full bg-rose-500 text-white hover:opacity-90 transition-all"
        >
          Subscribe
        </button>
      </Modal>
    </div>
  );
};

export default SubscriptionPage;
