import type { ReactElement, ReactNode } from "react";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";

interface FormProperties<T extends FieldValues> {
  children: ReactNode;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  formId: string;
  schema: ZodType;
}

export default function Form<T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  formId,
  schema,
}: FormProperties<T>): ReactElement {
  const methods: UseFormReturn<T> = useForm<T>({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} id={formId}>
        {children}
      </form>
    </FormProvider>
  );
}
