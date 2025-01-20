import classNames from "classnames";
import type { ReactElement } from "react";
import { FieldValues, useFormContext, useFormState } from "react-hook-form";

interface InputProperties<T extends FieldValues> {
  name: keyof T & string;
  label: string;
}

export default function Input<T extends FieldValues>({ label, name }: InputProperties<T>): ReactElement {
  const { register } = useFormContext();
  const { errors } = useFormState({
    name,
  });

  return (
    <label className="flex flex-col">
      <span className="text-body-medium text-light-onSurface p-1">{label}</span>
      <input
        {...register(name)}
        className="text-body-large text-light-onSurface p-1 border-light-outline border-2 rounded-md pl-2 caret-light-primary"
        autoComplete="on"
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
