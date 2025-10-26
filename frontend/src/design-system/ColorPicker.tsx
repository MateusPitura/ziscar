import { useEffect, useState, type ReactElement } from "react";
import { SketchPicker } from "react-color";
import {
  FieldValues,
  Path,
  useController,
  useFormContext,
} from "react-hook-form";
import Button from "./Button";
import ColorPreview from "./ColorPreview";
import Command from "./Form/Command";
import InputError from "./Form/InputError";
import InputLabel from "./Form/InputLabel";
import { Popover } from "./Popover";
import { colors } from "./constants/colors";

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
  const { control, register } = useFormContext<T>();
  const [isOpen, setIsOpen] = useState(false);
  const [addColor, setAddColor] = useState(false);

  const { field } = useController({
    name,
    control,
  });

  const selectedValue = field.value;

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <label className="flex flex-col">
      <InputLabel label={label} required={required} />
      <Popover
        open={isOpen}
        onOpenChange={(state) => {
          setIsOpen(state);
          if (!state) setAddColor(false);
        }}
      >
        <Popover.Trigger asChild>
          <Button
            label={
              selectedValue ? (
                <div className="flex items-center">
                  <ColorPreview color={selectedValue} />
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
          {addColor ? (
            <SketchPicker
              color={field.value}
              onChange={(color) => field.onChange(color.hex.replace("#", ""))}
              disableAlpha
              presetColors={[]}
            />
          ) : (
            <Command
              options={colors}
              onChange={(value) => {
                if (value === selectedValue) {
                  field.onChange("");
                } else {
                  field.onChange(value);
                }
                setIsOpen(false);
              }}
              customLabel={(option) => (
                <div className="flex items-center gap-1">
                  <ColorPreview color={option.value} className="!h-3 w-6"/>
                  {option.label}
                </div>
              )}
              register={register}
              name={name}
              showSearch
              selectedValue={selectedValue}
              onSearchChange={() => field.onChange("")}
              notFound={
                <Button
                  className="justify-self-center"
                  variant="quaternary"
                  tooltipMessage="Adicionar cor"
                  label="Adicionar cor"
                  onClick={() => setAddColor(true)}
                />
              }
            />
          )}
        </Popover.Content>
      </Popover>
      {hideErrorLabel || <InputError name={name} required={required} />}
    </label>
  );
}
