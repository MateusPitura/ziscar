import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { safeFetch } = useSafeFetch();
  const { userLogged } = useGlobalContext();
  const queryClient = useQueryClient();

  async function updateProfileEmail(data: EmailFormInputs) {
    // TODO: criar um hook genérico para isso
    await safeFetch({
      path: `/users/${userLogged?.id}`, //  TODO: Ao implementar o back-end criar uma request que não precise de id, pegar o id automaticamente
      method: "PATCH",
      body: data,
    });
  }

  const mutation = useMutation({
    mutationFn: updateProfileEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileInfo"] });
      showSuccessSnackbar({
        title: "Email atualizado com sucesso",
      });
      onSuccessSubmit();
    },
  });

  async function handleSubmit(data: EmailFormInputs) {
    mutation.mutate(data);
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
