import { lazy, useCallback, type ReactElement } from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { Childrenable } from "@/domains/global/types";

const DevTool = import.meta.env.PROD
  ? () => null
  : lazy(() => import("@/domains/global/components/HookFormDevTool"));

interface FormProperties<T extends FieldValues> extends Childrenable {
  onSubmit: (data: T) => void;
  defaultValues: DefaultValues<T>;
  schema: ZodType;
  className?: string;
  onlyDirty?: boolean;
  replaceEmptyStringToNull?: boolean;
}

type Field = Record<string, unknown>;

function getDirtyValues(dirtyFields: Field | boolean, allValues: Field): Field {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;
  return Object.fromEntries(
    Object.keys(dirtyFields)
      .filter((key) => (dirtyFields as Field)[key] !== false)
      .map((key) => [
        key,
        getDirtyValues(
          (dirtyFields as Field)[key] as Field,
          allValues[key] as Field
        ),
      ])
  );
}

export default function Form<T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  schema,
  className,
  onlyDirty,
  replaceEmptyStringToNull = true,
}: FormProperties<T>): ReactElement {
  const methods: UseFormReturn<T> = useForm<T>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const safeOnSubmit = useCallback(
    (data: Record<string, unknown>) => {
      let valueCopy = Object.assign({}, data);
      if (onlyDirty) {
        valueCopy = getDirtyValues(methods.formState.dirtyFields, data);
      }
      if (replaceEmptyStringToNull) {
        const valuesString = JSON.stringify(valueCopy);
        const valuesFormatted = valuesString.replace(/""/g, "null");
        valueCopy = JSON.parse(valuesFormatted);
      }
      onSubmit(valueCopy as T);
    },
    [
      onSubmit,
      methods.formState.dirtyFields,
      onlyDirty,
      replaceEmptyStringToNull,
    ]
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(safeOnSubmit)}
        noValidate
        className={className}
      >
        {children}
      </form>
      {import.meta.env.DEV && (
        <DevTool
          control={(methods as UseFormReturn<FieldValues, unknown>).control}
        />
      )}
    </FormProvider>
  );
}
