import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  title?: string;
  onClose?: () => void;
};

const Card = ({ children, title, onClose }: CardProps) => {
  return (
    <div className="relative bg-white rounded-xl p-6 shadow-xl border border-gray-200 flex flex-col justify-between  transition-transform">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
      )}
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default Card;
