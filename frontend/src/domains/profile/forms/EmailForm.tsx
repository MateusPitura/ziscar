import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import type { ReactElement } from "react";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";

const SchemaEmailForm = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type EmailFormInputs = z.infer<typeof SchemaEmailForm>;

interface EmailFormProperties {
  formId: string;
  onSuccessSubmit: () => void;
  defaultValues: Partial<EmailFormInputs>;
}

export default function EmailForm({
  formId,
  onSuccessSubmit,
  defaultValues,
}: EmailFormProperties): ReactElement {
  const { handleSubmit } = useUpdateProfileInfo<EmailFormInputs>({
    onSuccessSubmit,
    snackbarTitle: "Email atualizado com sucesso",
  });

  return (
    <Form<EmailFormInputs>
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      formId={formId}
      schema={SchemaEmailForm}
    >
      <Input<EmailFormInputs> name="email" label="Email" />
    </Form>
  );
}
