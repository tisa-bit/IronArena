/* eslint-disable @typescript-eslint/no-explicit-any */


type DropdownFilterProps<T> = {
  items: T[];
  valueKey: keyof T; // field to use as value
  labelKey: keyof T; // field to show as label
  selectedValue: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
};

function DropdownFilter<T>({
  items,
  valueKey,
  labelKey,
  selectedValue,
  onChange,
  placeholder = "Select",
  className = "",
}: DropdownFilterProps<T>) {
  return (
    <select
      value={selectedValue}
      onChange={(e) =>
        onChange(
          isNaN(Number(e.target.value))
            ? e.target.value
            : Number(e.target.value)
        )
      }
      className={`border p-2 rounded-lg ${className}`}
    >
      <option value="">{placeholder}</option>
      {items.map((item, idx) => (
        <option key={idx} value={item[valueKey] as any}>
          {item[labelKey] as any}
        </option>
      ))}
    </select>
  );
}

export default DropdownFilter;
