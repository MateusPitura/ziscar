import { Fragment, type ReactNode } from "react";
import Tooltip from "../Tooltip";
import Button from "../Button";
import {
  ArrayPath,
  FieldArray as FieldArrayRHF,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import InputError from "./InputError";

interface FieldArrayProperties<T extends FieldValues> {
  name: ArrayPath<T>;
  removeText: string;
  appendText: string;
  maxLength?: number;
  appendDefaultValues: FieldArrayRHF<T>;
  render: (index: number) => ReactNode;
}

export default function FieldArray<T extends FieldValues>({
  render,
  name,
  appendText,
  removeText,
  maxLength,
  appendDefaultValues,
}: FieldArrayProperties<T>): ReactNode {
  const { fields, append, remove } = useFieldArray<T>({
    name,
  });

  return (
    <>
      {fields.map((field, index) => {
        return (
          <Fragment key={field.id}>
            <div className="flex items-center justify-end col-span-full">
              <Tooltip content={removeText}>
                <Button
                  variant="quaternary"
                  iconLeft="Delete"
                  onClick={() => {
                    remove(index);
                  }}
                />
              </Tooltip>
            </div>
            {render(index)}
          </Fragment>
        );
      })}
      {(maxLength && fields.length >= maxLength) || (
        <div className="col-span-full">
          <Button
            variant="secondary"
            label={appendText}
            onClick={() => {
              append(appendDefaultValues);
            }}
            fullWidth
            textAlign="center"
          />
          <InputError name={name} isFieldArray />
        </div>
      )}
    </>
  );
}
