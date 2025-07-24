import classNames from "classnames";
import type { ReactNode } from "react";
import { useFormState } from "react-hook-form";
import get from "lodash/get";

interface ErrorLabelProperties {
  name: string;
}

export default function ErrorLabel({ name }: ErrorLabelProperties): ReactNode {
  const { errors } = useFormState({
    name,
  });

  const errorsFormatted = get(errors, name);

  return (
    <span
      className={classNames("text-body-small text-red-500 p-1", {
        invisible: !errorsFormatted,
      })}
    >
      {errorsFormatted?.message?.toString() ?? "Campo inválido"}
    </span>
  );
}
