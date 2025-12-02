"use client";

import { Plan } from "@/types/types";
import Card from "../common/Cards";
import Modal from "../common/Modal";

type SubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
};

const SubscriptionModal = ({
  isOpen,
  onClose,
  plans,
  onSelectPlan,
}: SubscriptionModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Choose a Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} title={plan.name}>
            <p className="text-gray-600">{plan.plandescription}</p>
            <p className="mt-2 font-bold">${plan.amount / 100}/year</p>
            <button
              onClick={() => onSelectPlan(plan)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Select Plan
            </button>
          </Card>
        ))}
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
