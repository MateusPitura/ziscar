import type { ReactElement, ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface FormProperties {
  children: ReactNode;
  onSubmit: () => void;
  defaultValues: object;
}

export default function Form({
  children,
  onSubmit,
  defaultValues,
}: FormProperties): ReactElement {
  const methods = useForm({
    defaultValues: defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
