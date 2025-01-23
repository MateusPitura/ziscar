import { Mask } from "@/domains/global/types/Mask";
import { applyMask } from "@/domains/global/utils/applyMask";
import classNames from "classnames";
import { useEffect, type ReactElement } from "react";
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import Button from "./Button";

interface InputProperties<T extends FieldValues> {
  name: keyof T & string;
  label: string;
  placeholder?: string;
  mask?: Mask;
  iconRight?: ReactElement;
  onClickIconRight?: () => void;
  type?: string;
  maxLength?: number;
  required?: boolean;
}

export default function Input<T extends FieldValues>({
  label,
  name,
  placeholder,
  mask,
  iconRight,
  onClickIconRight,
  type = "text",
  maxLength,
  required,
}: InputProperties<T>): ReactElement {
  const { register, setValue } = useFormContext();
  const { errors } = useFormState({
    name,
  });
  const value = useWatch({ name });

  useEffect(() => {
    if (mask) {
      const valueFormatted = applyMask(value, mask);
      setValue<string>(name, valueFormatted);
    }
  }, [value]);

  return (
    <label className="flex flex-col">
      <div>
        <span className="text-body-medium text-light-onSurface p-1">
          {label}
        </span>
        {required && (
          <span className="text-light-error text-body-medium">*</span>
        )}
      </div>
      <div className="border-light-outline border-2 rounded-md flex items-center px-1 gap-1">
        <input
          {...register(name)}
          className="text-body-large text-light-onSurface bg-transparent p-1 caret-light-primary flex-1 h-10"
          autoComplete="on"
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          required={required}
        />
        {iconRight && (
          <Button
            variant="tertiary"
            iconLeft={iconRight}
            padding="none"
            onClick={onClickIconRight}
          />
        )}
      </div>
      <span
        className={classNames("text-body-small text-light-error p-1", {
          invisible: !errors[name],
        })}
      >
        {errors[name]?.message?.toString() ?? "Campo inválido"}
      </span>
    </label>
  );
}
