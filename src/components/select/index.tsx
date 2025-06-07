import Select from "react-select";

export interface SelectValue {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: SelectValue[];
  isMulti?: boolean;
  value: SelectValue | SelectValue[] | null;
  onChange: (value: SelectValue | SelectValue[] | null) => void;
  placeholder?: string;
}

export default function Dropdown({
  options,
  isMulti = false,
  value,
  onChange,
  placeholder = "Select...",
}: DropdownProps) {
  const formattedOptions = options.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));

  const formattedValue = (() => {
    if (isMulti) {
      return Array.isArray(value)
        ? value.map((val) => ({
            label: val.label,
            value: val.value,
          }))
        : [];
    } else {
      return value
        ? {
            label: (value as SelectValue).label,
            value: (value as SelectValue).value,
          }
        : null;
    }
  })();

  const handleChange = (selected: any) => {
    if (isMulti) {
      onChange(
        selected?.map((s: SelectValue) => ({
          label: s.label,
          value: s.value,
        })) || []
      );
    } else {
      onChange(
        selected ? { label: selected.label, value: selected.value } : null
      );
    }
  };

  return (
    <Select
      options={formattedOptions}
      isMulti={isMulti}
      value={formattedValue}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}
