import { useCallback, type ReactElement } from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { Childrenable } from "@/domains/global/types/components";
import { DevTool } from "@hookform/devtools";

interface FormProperties<T extends FieldValues> extends Childrenable {
  onSubmit: (data: T) => void;
  defaultValues: DefaultValues<T>;
  schema: ZodType;
  className?: string;
  onlyDirty?: boolean;
}

function getDirtyValues(
  dirtyFields: Record<string, unknown> | boolean,
  allValues: Record<string, unknown>
): Record<string, unknown> {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;
  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      getDirtyValues(
        (dirtyFields as Record<string, unknown>)[key] as Record<
          string,
          unknown
        >,
        allValues[key] as Record<string, unknown>
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
}: FormProperties<T>): ReactElement {

  const methods: UseFormReturn<T> = useForm<T>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const safeOnSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const values = onlyDirty
        ? getDirtyValues(methods.formState.dirtyFields, data)
        : data;
      const dataString = JSON.stringify(values);
      const dataFormatted = dataString.replace(/""/g, "null");
      const dataCopy = JSON.parse(dataFormatted);
      onSubmit(dataCopy as T);
    },
    [onSubmit, methods.formState.dirtyFields, onlyDirty]
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
      <DevTool control={methods.control} />
    </FormProvider>
  );
}
