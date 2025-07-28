import { Childrenable, UnwrapArray } from "@/domains/global/types";
import { createContext, ReactNode, useContext, type ReactElement } from "react";
import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form";
import InputError from "./InputError";

interface ChoiceContextValues {
  hideErrorLabel?: boolean;
  required?: boolean;
}

const ChoiceContext = createContext<ChoiceContextValues>({
  hideErrorLabel: false,
  required: false,
});

function useChoiceContext() {
  const context = useContext(ChoiceContext);
  if (!context)
    throw new Error("useChoiceContext must be used within a ChoiceProvider");
  return context;
}

type ContainerProps = Childrenable & ChoiceContextValues;

function Container({
  children,
  hideErrorLabel,
  required,
}: ContainerProps): ReactElement {
  return (
    <ChoiceContext.Provider value={{ hideErrorLabel, required }}>
      {children}
    </ChoiceContext.Provider>
  );
}

type RadioProperties<T extends FieldValues> = {
  [K in Path<T>]: {
    label: string;
    name: K;
    value: PathValue<T, K>;
  };
}[Path<T>];

function Radio<T extends FieldValues>({
  label,
  name,
  ...props
}: RadioProperties<T>): ReactNode {
  const { register } = useFormContext();
  const { hideErrorLabel, required } = useChoiceContext();

  if (!name) return;

  return (
    <label className="flex gap-2 items-start cursor-pointer hover:opacity-50">
      <div className="grid place-items-center mt-1">
        <input
          type="radio"
          {...register(name)}
          className="peer col-start-1 row-start-1 appearance-none shrink-0 w-4 h-4 border-2 border-slate-800 rounded-full disabled:border-neutral-300 cursor-pointer"
          required={required}
          data-cy={`form-radio-${label}`}
          {...props}
        />
        <div className="col-start-1 row-start-1 w-2 h-2 rounded-full peer-checked:bg-slate-800 peer-checked:peer-disabled:bg-neutral-300" />
      </div>
      <div className="text-body-large text-neutral-700">{label}</div>
      {hideErrorLabel || <InputError name={name} />}
    </label>
  );
}

type CheckboxProperties<T extends FieldValues> = {
  [K in Path<T>]: {
    label: string;
    name: K;
    value: UnwrapArray<PathValue<T, K>>;
  };
}[Path<T>];

function Checkbox<T extends FieldValues>({
  label,
  name,
  ...props
}: CheckboxProperties<T>): ReactNode {
  const { register } = useFormContext();
  const { hideErrorLabel, required } = useChoiceContext();

  if (!name) return;

  return (
    <label className="flex gap-2 items-center cursor-pointer hover:opacity-50">
      <input
        type="checkbox"
        {...register(name)}
        className="col-start-1 row-start-1 shrink-0 w-4 h-4 border-2 accent-slate-800 disabled:border-neutral-300 cursor-pointer"
        required={required}
        {...props}
      />
      <div className="text-body-large text-neutral-700">{label}</div>
      {hideErrorLabel || <InputError name={name} />}
    </label>
  );
}

const Choice = Object.assign(Container, { Radio, Checkbox });

export default Choice;
