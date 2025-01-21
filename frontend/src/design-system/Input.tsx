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

interface InputProperties<T extends FieldValues> {
  name: keyof T & string;
  label: string;
  placeholder?: string;
  mask?: Mask;
}

export default function Input<T extends FieldValues>({
  label,
  name,
  placeholder,
  mask,
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
      <span className="text-body-medium text-light-onSurface p-1">{label}</span>
      <input
        {...register(name)}
        className="text-body-large text-light-onSurface p-1 border-light-outline border-2 rounded-md pl-2 caret-light-primary"
        autoComplete="on"
        placeholder={placeholder}
      />
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
