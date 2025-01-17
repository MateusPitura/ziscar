import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import type { ReactElement } from "react";

interface PasswordFormProperties {
  formId: string;
}

export default function PasswordForm({
  formId,
}: PasswordFormProperties): ReactElement {
  const { showSuccessSnackbar } = useSnackbar();

  function handleOnSubmit(data) {
    console.log("🌠 data: ", data);
    showSuccessSnackbar({
      title: "Senha atualizada com sucesso",
    });
  }

  return (
    <Form onSubmit={handleOnSubmit} formId={formId}>
      <Input label="Nova senha" name="newPassword" />
      <Input label="Confirmar senha" name="confirmPassword" />
    </Form>
  );
}
