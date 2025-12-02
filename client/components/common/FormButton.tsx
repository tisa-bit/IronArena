import React from "react";

type Props = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

const FormButton = ({
  type = "button",
  children,
  onClick,
  variant = "primary",
  className = "",
}: Props) => {
  const baseStyle =
    "w-full py-3 rounded-full font-semibold transition-all shadow-lg";
  const variantStyle =
    variant === "primary"
      ? "text-white bg-rose-500 hover:opacity-90"
      : "border border-gray-300 text-gray-600 hover:bg-gray-100";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default FormButton;
