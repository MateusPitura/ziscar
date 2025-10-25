import { UnwrapArray } from "@/domains/global/types";
import { useEffect, useState, type ReactNode } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form";
import Button from "../Button";
import { Popover } from "../Popover";
import Command from "./Command";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

export type SelectProperties<T extends FieldValues | undefined = undefined> = {
  [K in Path<T>]: {
    options: {
      value: UnwrapArray<PathValue<T, K>>;
      label: string;
      description?: string;
    }[];
    name: K;
    disabled?: boolean;
    loading?: boolean;
    hideErrorLabel?: boolean;
    label: string;
    required?: boolean;
    onChange?: (value?: string) => void;
    onSearchChange?: (search: string) => void;
    shouldFilter?: boolean;
    notFound?: ReactNode;
  };
}[Path<T>];

export default function Select<T extends FieldValues>({
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
  notFound,
}: SelectProperties<T>): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const { register, control } = useFormContext<T>();

  const { field } = useController({
    name,
    control,
  });

  const selectedValue = field.value;

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <label className="flex flex-col">
      <InputLabel label={label} required={required} />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="secondary"
            label={
              (selectedValue &&
                options.find((item) => item.value === selectedValue)?.label) ||
              "Selecione um item"
            }
            tooltipMessage={undefined}
            iconRight="UnfoldMore"
            fullWidth
            state={disabled ? "disabled" : undefined}
            className="!h-10"
            data-cy={`select-${name}`}
          />
        </Popover.Trigger>
        <Popover.Content align="start" className="!p-2">
          <Command<T>
            shouldFilter={shouldFilter}
            loading={loading}
            options={options}
            onChange={(value) => {
              if (value === selectedValue) {
                onChange?.(undefined);
                field.onChange("");
              } else {
                onChange?.(value);
                field.onChange(value);
              }
              setIsOpen(false);
            }}
            register={register}
            name={name}
            notFound={notFound}
            showSearch
            selectedValue={selectedValue}
            onSearchChange={(search) => {
              onChange?.(undefined);
              field.onChange("");
              onSearchChange?.(search);
            }}
          />
        </Popover.Content>
      </Popover>
      {hideErrorLabel || <InputError name={name} required={required} />}
    </label>
  );
}
