import { Mask } from "@/domains/global/types/mask";
import { applyMask } from "@/domains/global/utils/applyMask";
import { useEffect, type ReactElement } from "react";
import {
  FieldValues,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import Button from "../Button";
import ErrorLabel from "./ErrorLabel";

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
  hideErrorLabel?: boolean;
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
  hideErrorLabel,
}: InputProperties<T>): ReactElement {
  const { register, setValue } = useFormContext();
  const { errors } = useFormState({
    name,
  });
  const value = useWatch({ name });

  useEffect(() => {
    if (mask) {
      const valueFormatted = applyMask(value, mask);
      setValue<string>(name, valueFormatted, {
        shouldDirty: true,
      });
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
      <div className="border-light-outline border-2 rounded-md flex items-center gap-1 overflow-hidden">
        <input
          {...register(name)}
          className="text-body-large text-light-onSurface bg-transparent p-1 px-2 caret-light-primary flex-1 h-10"
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
      {hideErrorLabel || <ErrorLabel errors={errors} name={name} />}
    </label>
  );
}
