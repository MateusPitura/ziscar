import { useEffect, useState, type ReactElement } from "react";
import { SketchPicker } from "react-color";
import {
  Controller,
  FieldValues,
  Path,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Popover } from "./Popover";
import Button from "./Button";
import InputLabel from "./Form/InputLabel";
import ErrorLabel from "./Form/ErrorLabel";

interface ColorPickerProperties<T extends FieldValues> {
  name: Path<T>;
  disabled?: boolean;
  label: string;
  required?: boolean;
  hideErrorLabel?: boolean;
}

export default function ColorPicker<T extends FieldValues>({
  name,
  disabled,
  label,
  required,
  hideErrorLabel,
}: ColorPickerProperties<T>): ReactElement {
  const { control } = useFormContext<T>();
  const [isOpen, setIsOpen] = useState(false);

  const watch = useWatch({
    name,
  });

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <label className="flex flex-col">
      <InputLabel label={label} required={required} />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger>
          <Button
            label={
              watch ? (
                <div className="flex gap-2 items-center font-mono">
                  {watch}
                  <div
                    className="h-4 w-4 rounded-md border border-neutral-300"
                    style={{ backgroundColor: watch }}
                  />
                </div>
              ) : (
                "Selecione uma cor"
              )
            }
            variant="secondary"
            fullWidth
            state={disabled ? "disabled" : undefined}
            className="!h-10"
          />
        </Popover.Trigger>
        <Popover.Content className="!p-0 w-fit" align="start">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <SketchPicker
                color={field.value}
                onChange={(color) => field.onChange(color.hex)}
                disableAlpha
              />
            )}
          />
        </Popover.Content>
      </Popover>
      {hideErrorLabel || <ErrorLabel name={name} />}
    </label>
  );
}
