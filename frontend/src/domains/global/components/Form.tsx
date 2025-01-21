import { useCallback, useMemo, type ReactElement, type ReactNode } from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodObject, ZodType } from "zod";

interface FormProperties<T extends FieldValues> {
  children: ReactNode;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  schema: ZodType;
}

export default function Form<T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  schema,
}: FormProperties<T>): ReactElement {
  const safeDefaultValues = useMemo(() => {
    /**
     * This function is necessary because if some default value is undefined or
     * null RHF replace it for an empty string, and this cause isDirty to fire
     * So if the initial value already is a empty string this works fine
     * But if the schema has some ZodEffect, like .refine() in object, the if statement
     * will be false, in this cause you need to pass defaultValues with empty strings
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
    (data: T) => {
      const dataCopy = Object.assign({}, data);
      Object.keys(dataCopy).forEach((key) => {
        if (dataCopy[key] === "") {
          delete dataCopy[key];
        }
      });
      onSubmit(dataCopy);
    },
    [onSubmit]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(safeOnSubmit)} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
