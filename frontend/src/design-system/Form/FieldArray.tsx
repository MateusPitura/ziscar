import Section from "@/domains/global/components/Section";
import { Fragment, type ReactNode } from "react";
import {
  ArrayPath,
  FieldArray as FieldArrayRHF,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import Button from "../Button";
import InputError from "./InputError";

interface FieldArrayProperties<T extends FieldValues> {
  name: ArrayPath<T>;
  removeText: string;
  appendText: string;
  maxLength?: number;
  appendDefaultValues: FieldArrayRHF<T>;
  render: (index: number) => ReactNode;
  title: string;
  className?: string;
}

export default function FieldArray<T extends FieldValues>({
  render,
  name,
  appendText,
  removeText,
  maxLength,
  appendDefaultValues,
  title,
  className,
}: FieldArrayProperties<T>): ReactNode {
  const { fields, append, remove } = useFieldArray<T>({
    name,
  });

  return (
    <Section.Group>
      <Section.Header
        title={
          <div className="flex items-center justify-between">
            {title}
            {maxLength === 1 && !!fields.length && (
              <Button
                tooltipMessage={removeText}
                variant="quaternary"
                iconLeft="Delete"
                onClick={() => remove(0)}
                data-cy={`button-remove-${name}`}
              />
            )}
          </div>
        }
      />
      <Section.Body className={className}>
        {fields.map((field, index) => {
          return (
            <Fragment key={field.id}>
              {maxLength != 1 && (
                <div className="flex items-center justify-end col-span-full">
                  <Button
                    tooltipMessage={removeText}
                    variant="quaternary"
                    iconLeft="Delete"
                    onClick={() => {
                      remove(index);
                    }}
                    data-cy={`button-remove-${name}`}
                  />
                </div>
              )}
              {render(index)}
            </Fragment>
          );
        })}
        {(maxLength && fields.length >= maxLength) || (
          <div className="col-span-full">
            <Button
              tooltipMessage={undefined}
              variant="secondary"
              label={appendText}
              onClick={() => {
                append(appendDefaultValues);
              }}
              fullWidth
              textAlign="center"
              data-cy={`button-append-${name}`}
            />
            <InputError name={name} isFieldArray />
          </div>
        )}
      </Section.Body>
    </Section.Group>
  );
}
