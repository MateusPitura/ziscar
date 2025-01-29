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
import { Childrenable } from "@/domains/global/types/Components";

interface FormProperties<T extends FieldValues> extends Childrenable {
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  schema: ZodType;
  className?: string;
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
    (data: Record<string, unknown>) => {
      const dataCopy = Object.assign({}, data);
      Object.keys(dataCopy).forEach((key) => {
        if (dataCopy[key] === "") {
          dataCopy[key] = null;
        }
      });
      onSubmit(dataCopy as T);
    },
    [onSubmit]
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
    </FormProvider>
  );
}
