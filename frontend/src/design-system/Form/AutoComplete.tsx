import { useEffect, useState, type ReactNode } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  useFormContext
} from "react-hook-form";
import { Popover } from "../Popover";
import Command from "./Command";
import Input from "./Input";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { SelectProperties } from "./Select";

export default function AutoComplete<T extends FieldValues>({
  options,
  name,
  disabled,
  loading = false,
  hideErrorLabel,
  label,
  required = false,
  onChange,
  onSearchChange,
  shouldFilter = true,
}: SelectProperties<T>): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const { setValue } = useFormContext<T>();

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <label className="flex flex-col">
      <InputLabel label={label} required={required} />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Input
          name={name}
          hideErrorLabel
          disabled={disabled}
          data-cy={`select-${name}`}
          autoComplete={false}
          onChange={(value) => {
            setIsOpen(true);
            onSearchChange?.(value);
          }}
        />
        <Popover.Trigger />
        <Popover.Content align="start" className="!p-2">
          <Command
            shouldFilter={shouldFilter}
            loading={loading}
            options={options}
            onChange={(value) => {
              onChange?.(value);
              setValue(name, value as PathValue<T, Path<T>>);
              setIsOpen(false);
            }}
            valueKey="label"
          />
        </Popover.Content>
      </Popover>
      {hideErrorLabel || <InputError name={name} required={required} />}
    </label>
  );
}
