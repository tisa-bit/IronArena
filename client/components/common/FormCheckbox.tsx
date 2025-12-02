import React from "react";

type Props = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormCheckbox = ({ label, checked, onChange }: Props) => {
  return (
    <label className="flex items-center gap-2 mt-2 text-black">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

export default FormCheckbox;
