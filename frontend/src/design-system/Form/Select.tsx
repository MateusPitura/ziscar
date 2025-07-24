import { useEffect, useState, type ReactNode } from "react";
import { Popover } from "../Popover";
import Button from "../Button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Options } from "@/domains/global/types";
import Icon from "../Icon";
import Spinner from "../Spinner";
import ErrorLabel from "./ErrorLabel";
import InputLabel from "./InputLabel";

interface SelectProperties<T> {
  options: Options[];
  name: Path<T>;
  disabled?: boolean;
  loading?: boolean;
  hideErrorLabel?: boolean;
  label: string;
  required?: boolean;
  onChange?: (value?: string) => void;
  onSearchChange?: (search: string) => void;
  shouldFilter?: boolean;
}

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
}: SelectProperties<T>): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const { register, control } = useFormContext<T>();

  const { field } = useController({
    name,
    control,
  });

  const watch = useWatch({
    name,
  });

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <label className="flex flex-col">
      <InputLabel label={label} required={required} />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger>
          <Button
            variant="secondary"
            label={
              (watch && options.find((item) => item.value === watch)?.label) ||
              "Selecione um item"
            }
            iconRight="UnfoldMore"
            fullWidth
            state={disabled ? "disabled" : undefined}
            className="!h-10"
          />
        </Popover.Trigger>
        <Popover.Content align="start" className="!p-2">
          <Command shouldFilter={shouldFilter}>
            <CommandInput
              placeholder="Pesquise"
              autoFocus
              className="text-body-medium text-neutral-700"
              onValueChange={(search) => {
                onChange?.(undefined);
                field.onChange("");
                onSearchChange?.(search);
              }}
            />
            <CommandList {...register(name)}>
              {loading ? (
                <div className="flex items-center justify-center p-2">
                  <Spinner />
                </div>
              ) : (
                <>
                  <CommandEmpty className="text-neutral-700 flex items-center justify-center p-2 text-body-medium min-h-14">
                    Nenhum item encontrado
                  </CommandEmpty>
                  {options.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(value) => {
                          if (value === watch) {
                            onChange?.(undefined);
                            field.onChange("");
                            return;
                          }
                          onChange?.(value);
                          field.onChange(value);
                        }}
                        className="flex !text-neutral-700"
                        keywords={[option.label]}
                      >
                        <span className="flex-1">{option.label}</span>
                        {watch === option.value && <Icon iconName="Check" />}
                      </CommandItem>
                    );
                  })}
                </>
              )}
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover>
      {hideErrorLabel || <ErrorLabel name={name} />}
    </label>
  );
}
