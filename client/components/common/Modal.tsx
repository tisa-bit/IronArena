// components/common/Modal.tsx
"use client";

import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string; // optional styling
};

const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 z-50"
      onClick={onClose}
    >
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 ${className || ""}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
