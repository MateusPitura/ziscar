import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState, type ReactNode } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from "react-hook-form";
import { Popover } from "../Popover";
import Spinner from "../Spinner";
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
          onChange={(value) => {
            setIsOpen(true);
            onSearchChange?.(value);
          }}
          autoComplete={false}
        />
        <Popover.Trigger />
        <Popover.Content align="start" className="!p-2">
          <Command shouldFilter={shouldFilter}>
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center p-2">
                  <Spinner />
                </div>
              ) : (
                <>
                  <CommandEmpty className="text-neutral-700 flex items-center justify-center p-2 text-body-medium min-h-14">
                    {"Nenhum item encontrado"}
                  </CommandEmpty>
                  {options.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        data-cy={`select-option-${option.value}`}
                        onSelect={(value) => {
                          onChange?.(value);
                          setValue(name, value as PathValue<T, Path<T>>);
                          setIsOpen(false);
                        }}
                        className="flex !text-neutral-700 text-body-medium"
                        keywords={[option.label]}
                      >
                        <div className="flex-1">
                          <p>{option.label}</p>
                          {option.description && (
                            <p className="text-label-medium text-neutral-500">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </>
              )}
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover>
      {hideErrorLabel || <InputError name={name} required={required} />}
    </label>
  );
}
