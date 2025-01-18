import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import useFetch from "@/domains/global/hooks/useFetch";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
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
  const { request } = useFetch();
  const { userLogged } = useGlobalContext();

  async function handleSubmit(data: EmailFormInputs) {
    const response =  await request({
      path: `/users/${userLogged?.id}`, //  TODO: Ao implementar o back-end criar uma request que não precise de id, pegar o id automaticamente
      method: "PATCH",
      body: data,
    });
    if (!response) return;
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
