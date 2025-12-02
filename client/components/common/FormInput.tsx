/* eslint-disable @typescript-eslint/no-explicit-any */
interface FormInputProps {
  label?: string;
  name: string;
  register: any;
  error?: any;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  label,
  name,
  register,
  error,
  type = "text",
  value,
  onChange,
  placeholder,
}: FormInputProps) => {
  return (
    <div>
      {label && <label className="block mb-1 text-gray-600">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        value={value}
        onChange={onChange}
        className={`w-full pl-4 pr-4 py-3 rounded-full border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:border-rose-400 text-gray-600`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;
