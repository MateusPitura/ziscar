import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Command as CommandShadcn,
} from "@/components/ui/command";
import { Options } from "@/domains/global/types";
import type { ReactNode } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import Icon from "../Icon";
import Spinner from "../Spinner";

interface CommandProperties<T extends FieldValues> {
  shouldFilter?: boolean;
  loading?: boolean;
  options: Options[];
  onChange?: (value: string) => void;
  onSearchChange?: (search: string) => void;
  notFound?: ReactNode;
  register?: UseFormRegister<T>;
  name?: Path<T>;
  showSearch?: boolean;
  selectedValue?: string;
  valueKey?: keyof Options;
  customLabel?: (option: Options) => ReactNode;
}

export default function Command<T extends FieldValues>({
  shouldFilter = true,
  loading,
  options,
  onChange,
  onSearchChange,
  notFound,
  register,
  name,
  showSearch,
  selectedValue,
  valueKey = "value",
  customLabel,
}: CommandProperties<T>): ReactNode {
  return (
    <CommandShadcn shouldFilter={shouldFilter}>
      {showSearch && (
        <CommandInput
          placeholder="Pesquise"
          autoFocus
          className="text-body-medium text-neutral-700"
          onValueChange={onSearchChange}
        />
      )}
      <CommandList {...(name ? register?.(name) : {})}>
        {loading ? (
          <div className="flex items-center justify-center p-2">
            <Spinner />
          </div>
        ) : (
          <>
            <CommandEmpty className="text-neutral-700 flex items-center justify-center p-2 text-body-medium min-h-14">
              {notFound || "Nenhum item encontrado"}
            </CommandEmpty>
            {options.map((option) => {
              return (
                <CommandItem
                  key={option.value}
                  value={option[valueKey]}
                  data-cy={`select-option-${option.value}`}
                  onSelect={onChange}
                  className="flex !text-neutral-700 text-body-medium"
                  keywords={[option.label]}
                >
                  <div className="flex-1">
                    {customLabel ? customLabel(option) : <p>{option.label}</p>}
                    {option.description && (
                      <p className="text-label-medium text-neutral-500">
                        {option.description}
                      </p>
                    )}
                  </div>
                  {selectedValue === option.value && <Icon iconName="Check" />}
                </CommandItem>
              );
            })}
          </>
        )}
      </CommandList>
    </CommandShadcn>
  );
}
