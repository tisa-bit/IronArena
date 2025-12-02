"use client";

import { ReactNode } from "react";
import Modal from "../common/Modal";

type DeleteModalProps = {
  isOpen: boolean;
  message: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: DeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-sm">
      <div className="text-center">
        <p className="text-gray-700 text-lg">{message}</p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-rose-500 text-white font-semibold hover:opacity-90 transition-all"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
