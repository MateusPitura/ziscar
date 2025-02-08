import { useCallback, useMemo, type ReactElement } from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodObject, ZodType } from "zod";
import { Childrenable } from "@/domains/global/types/components";
import { DevTool } from "@hookform/devtools";

interface FormProperties<T extends FieldValues> extends Childrenable {
  onSubmit: (data: T) => void;
  defaultValues: DefaultValues<T>;
  schema: ZodType;
  className?: string;
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
}: FormProperties<T>): ReactElement {
  const safeDefaultValues = useMemo(() => {
    /**
     * This function is necessary because if some default value is undefined or
     * null RHF replace it for an empty string, and this cause isDirty to fire
     * So if the initial value already is a empty string this works fine
     * But it don't cover some cases:
     * - The schema has a ZodEffect, like .refine() in object. Ensure that objets
     * itself isn't {} ou null/undefined and it's props aren't null/undefined
     * - The default should be an array. Ensure that a empty array is setted
     */
    const defaultValuesCopy = Object.assign({}, defaultValues);

    if (schema instanceof ZodObject) {
      Object.keys(schema.shape).forEach((key) => {
        defaultValuesCopy[key] = defaultValuesCopy[key] ?? "";
      });
    }
    return defaultValuesCopy;
  }, [defaultValues, schema]);

  const methods: UseFormReturn<T> = useForm<T>({
    defaultValues: safeDefaultValues,
    resolver: zodResolver(schema),
  });

  const safeOnSubmit = useCallback(
    (data: Record<string, unknown>) => {
      const dirtyValues = getDirtyValues(methods.formState.dirtyFields, data);
      const dataString = JSON.stringify(dirtyValues);
      const dataFormatted = dataString.replace(/""/g, "null");
      const dataCopy = JSON.parse(dataFormatted);
      onSubmit(dataCopy as T);
    },
    [onSubmit, methods.formState.dirtyFields]
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
