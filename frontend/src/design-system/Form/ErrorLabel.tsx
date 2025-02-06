import classNames from "classnames";
import type { ReactNode } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import get from "lodash/get";

interface ErrorLabelProperties {
  errors: FieldErrors<FieldValues>;
  name: string;
}

export default function ErrorLabel({
  errors,
  name,
}: ErrorLabelProperties): ReactNode {
  const errorsFormatted = get(errors, name);

  return (
    <span
      className={classNames("text-body-small text-light-error p-1", {
        invisible: !errorsFormatted,
      })}
    >
      {errorsFormatted?.message?.toString() ?? "Campo inválido"}
    </span>
  );
}
