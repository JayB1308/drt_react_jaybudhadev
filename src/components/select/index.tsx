import Select, { type SingleValue, type MultiValue } from "react-select";

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

  const handleChange = (
    selected: SingleValue<SelectValue> | MultiValue<SelectValue>
  ) => {
    if (isMulti) {
      onChange(
        Array.isArray(selected)
          ? selected.map((s) => ({
              label: s.label,
              value: s.value,
            }))
          : []
      );
    } else {
      const singleValue = selected as SingleValue<SelectValue>;
      onChange(
        singleValue ? { label: singleValue.label, value: singleValue.value } : null
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
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: 'transparent',
          borderColor: state.isFocused ? '#60A5FA' : '#4B5563',
          borderWidth: '2px',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#60A5FA'
          }
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: '#1E293B',
          border: '1px solid #4B5563',
          zIndex: 50
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? '#2D3748' : 'transparent',
          color: '#E2E8F0',
          '&:hover': {
            backgroundColor: '#2D3748'
          },
          '&:active': {
            backgroundColor: '#2D3748'
          }
        }),
        singleValue: (base) => ({
          ...base,
          color: '#E2E8F0'
        }),
        input: (base) => ({
          ...base,
          color: '#E2E8F0'
        }),
        placeholder: (base) => ({
          ...base,
          color: '#94A3B8'
        }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: 'transparent',
          border: '2px solid white',
          borderRadius: '4px'
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: '#E2E8F0',
          padding: '2px 6px'
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: '#94A3B8',
          ':hover': {
            backgroundColor: '#2D3748',
            color: '#E2E8F0'
          }
        }),
        indicatorsContainer: (base) => ({
          ...base,
          color: '#94A3B8'
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: '#94A3B8',
          ':hover': {
            color: '#E2E8F0'
          }
        }),
        clearIndicator: (base) => ({
          ...base,
          color: '#94A3B8',
          ':hover': {
            color: '#E2E8F0'
          }
        })
      }}
    />
  );
}
