import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import type { ReactElement } from "react";
import { z } from "zod";

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
  const { showSuccessSnackbar } = useSnackbar();

  function handleSubmit(data: EmailFormInputs) {
    console.log("🌠 data: ", data.email);
    showSuccessSnackbar({
      title: "Email atualizado com sucesso",
    });
    onSuccessSubmit();
  }

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
