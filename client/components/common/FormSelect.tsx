/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError } from "react-hook-form";

type Option = { value: number | string; label: string };

type Props = {
  label?: string;
  options: Option[];
  error?: FieldError;
  register: any;
  name: string;
  className?: string;
};

const FormSelect = ({
  label,
  options,
  error,
  register,
  name,
  className = "",
}: Props) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-gray-600 font-medium mb-1">{label}</label>
      )}
      <select
        {...register(name)}
        className={`w-full pl-4 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-rose-400 text-gray-600 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormSelect;
