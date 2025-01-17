import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import type { ReactElement } from "react";
import { z } from "zod";

const SchemaPasswordForm = z
  .object({
    newPassword: z
      .string()
      .min(11, { message: "Ao menos 11 caracteres" })
      .regex(/[a-z]/, { message: "Ao menos uma letra minúscula" })
      .regex(/[A-Z]/, { message: "Ao menos uma letra maiúscula" })
      .regex(/\d/, { message: "Ao menos um número" })
      .regex(/[@$!%*?&]/, {
        message: "Ao menos um caractere especial",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não são iguais",
    path: ["confirmPassword"],
  });

type PasswordFormInputs = z.infer<typeof SchemaPasswordForm>;

interface PasswordFormProperties {
  formId: string;
  onSuccessSubmit: () => void;
}

export default function PasswordForm({
  formId,
  onSuccessSubmit,
}: PasswordFormProperties): ReactElement {
  const { showSuccessSnackbar } = useSnackbar();

  function handleOnSubmit(data: PasswordFormInputs) {
    console.log("🌠 data: ", data.confirmPassword);
    console.log("🌠 data: ", data.newPassword);
    showSuccessSnackbar({
      title: "Senha atualizada com sucesso",
    });
    onSuccessSubmit();
  }

  return (
    <Form<PasswordFormInputs>
      onSubmit={handleOnSubmit}
      formId={formId}
      schema={SchemaPasswordForm}
    >
      <Input label="Nova senha" name="newPassword" />
      <Input label="Confirmar senha" name="confirmPassword" />
    </Form>
  );
}
