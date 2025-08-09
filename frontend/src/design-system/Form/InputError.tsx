import classNames from "classnames";
import type { ReactNode } from "react";
import { useFormState } from "react-hook-form";
import get from "lodash/get";

interface InputErrorProperties {
  name: string;
  isFieldArray?: boolean;
  required?: boolean;
}

function handleRequired(
  message?: string,
  required?: boolean
): string | undefined {
  if (message === "Campo obrigatório" && required) {
    return "";
  }
  return message;
}

export default function InputError({
  name,
  isFieldArray,
  required,
}: InputErrorProperties): ReactNode {
  const { errors } = useFormState({
    name,
  });

  const errorsFormatted = get(errors, name);

  return (
    <span
      className={classNames("text-body-small text-red-500 p-1 !h-6", {
        invisible: !errorsFormatted,
      })}
      data-cy={`input-error-${name}`}
    >
      {isFieldArray
        ? handleRequired(errorsFormatted?.root?.message?.toString(), required)
        : handleRequired(errorsFormatted?.message?.toString(), required) ??
          "Campo inválido"}
    </span>
  );
}
