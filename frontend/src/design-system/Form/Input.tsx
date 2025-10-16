import { Mask } from "@/domains/global/types";
import { applyMask } from "@/domains/global/utils/applyMask";
import classNames from "classnames";
import { useEffect, type ReactElement } from "react";
import { FieldValues, Path, useFormContext, useWatch } from "react-hook-form";
import Button from "../Button";
import { IconsName } from "../types";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

interface InputProperties<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  mask?: Mask;
  iconRight?: IconsName;
  onClickIconRight?: () => void;
  type?: string;
  maxLength?: number;
  required?: boolean;
  hideErrorLabel?: boolean;
  autoFocus?: boolean;
  forceUnselect?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  autoComplete?: boolean;
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
  autoFocus = false,
  forceUnselect,
  disabled = false,
  onChange,
  autoComplete = true,
}: InputProperties<T>): ReactElement {
  const { register, setValue } = useFormContext();
  const value = useWatch({ name });

  useEffect(() => {
    if (mask) {
      const valueFormatted = applyMask(value, mask);
      setValue<string>(name, valueFormatted);
    }
  }, [value, mask, name, setValue]);

  return (
    <label className="flex flex-col">
      {label && <InputLabel label={label} required={required} />}
      <div
        className={classNames(
          "border-neutral-500 border-2 rounded-md flex items-center gap-1 overflow-hidden h-10",
          {
            "!border-neutral-300": disabled,
          }
        )}
      >
        <input
          {...register(name)}
          className={classNames(
            "text-body-large text-neutral-700 bg-transparent p-1 px-2 caret-neutral-700 flex-1",
            {
              "!text-neutral-300": disabled,
            }
          )}
          autoComplete={autoComplete ? "on" : "off"}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          required={required}
          autoFocus={autoFocus}
          tabIndex={forceUnselect ? -1 : undefined}
          disabled={disabled}
          onBlur={(event) =>
            setValue<string>(name, event.target.value.trim(), {
              shouldDirty: true,
            })
          }
          onChange={(event) => onChange?.(event.target.value)}
        />
        {iconRight && (
          <div className="px-2">
            <Button
              variant="quaternary"
              iconRight={iconRight}
              padding="none"
              onClick={onClickIconRight}
              tooltipMessage={undefined}
            />
          </div>
        )}
      </div>
      {hideErrorLabel || <InputError name={name} />}
    </label>
  );
}
