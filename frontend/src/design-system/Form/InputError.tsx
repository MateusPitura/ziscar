import classNames from "classnames";
import get from "lodash/get";
import type { ReactNode } from "react";
import { useFormState } from "react-hook-form";

interface InputErrorProperties {
  name: string;
  isFieldArray?: boolean;
  required?: boolean;
}

export default function InputError({
  name,
  isFieldArray,
}: InputErrorProperties): ReactNode {
  const { errors } = useFormState({
    name,
  });

  const errorsFormatted = get(errors, name);

  return (
    <span
      className={classNames("text-label-small text-red-500 px-1 py-px !h-6", {
        invisible: !errorsFormatted,
      })}
      data-cy={errorsFormatted && `input-error-${name}`}
    >
      {isFieldArray
        ? errorsFormatted?.root?.message?.toString()
        : errorsFormatted?.message?.toString() ?? "Campo inválido"}
    </span>
  );
}
