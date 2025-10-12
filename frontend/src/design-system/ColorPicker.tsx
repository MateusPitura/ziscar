import { useEffect, useState, type ReactElement } from "react";
import { SketchPicker } from "react-color";
import {
  Controller,
  FieldValues,
  Path,
  useFormContext,
  useWatch,
} from "react-hook-form";
import Button from "./Button";
import ColorPreview from "./ColorPreview";
import InputError from "./Form/InputError";
import InputLabel from "./Form/InputLabel";
import { Popover } from "./Popover";

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
                <div className="flex items-center">
                  <ColorPreview color={watch} />
                </div>
              ) : (
                "Selecione uma cor"
              )
            }
            variant="secondary"
            fullWidth
            state={disabled ? "disabled" : undefined}
            className="!h-10"
            tooltipMessage={undefined}
          />
        </Popover.Trigger>
        <Popover.Content className="!p-0 w-fit" align="start">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <SketchPicker
                color={field.value}
                onChange={(color) => field.onChange(color.hex.replace("#", ""))}
                disableAlpha
                presetColors={[
                  "#FFFFFF",
                  "#C0C0C0",
                  "#808080",
                  "#000000",
                  "#C00000",
                  "#0033A0",
                  "#D8CAB8",
                  "#4B3621",
                  "#800020",
                ]}
              />
            )}
          />
        </Popover.Content>
      </Popover>
      {hideErrorLabel || <InputError name={name} required={required} />}
    </label>
  );
}
