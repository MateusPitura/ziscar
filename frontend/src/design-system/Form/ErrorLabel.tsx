import classNames from "classnames";
import type { ReactNode } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

interface ErrorLabelProperties {
  errors: FieldErrors<FieldValues>;
  name: string;
}

export default function ErrorLabel({ errors, name }: ErrorLabelProperties): ReactNode {
  return (
    <span
      className={classNames("text-body-small text-light-error p-1", {
        invisible: !errors[name],
      })}
    >
      {errors[name]?.message?.toString() ?? "Campo inválido"}
    </span>
  );
}
