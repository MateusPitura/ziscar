import Modal from "@/design-system/Modal";
import { type ReactElement } from "react";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/design-system/Form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@/domains/global/schemas";
import { SchemaPassword } from "@/domains/global/schemas/schemas";
import InputPassword from "@/design-system/Form/InputPassword";

type PasswordFormInputs = s.infer<typeof SchemaPassword>;

export default function PasswordForm(): ReactElement {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<{
    password: PasswordFormInputs["newPassword"];
  }>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "Senha atualizada com sucesso",
    shouldInvalidateQuery: false,
  });

  function handleSubmit(data: PasswordFormInputs) {
    mutate({ password: data.newPassword });
  }

  return (
    <Form<PasswordFormInputs>
      onSubmit={handleSubmit}
      schema={SchemaPassword}
      defaultValues={{
        confirmPassword: '',
        newPassword: '',
      }}
    >
      <PasswordFormContent isPending={isPending} />
    </Form>
  );
}

interface PasswordFormContentProps {
  isPending: boolean;
}

function PasswordFormContent({
  isPending,
}: PasswordFormContentProps): ReactElement {
  return (
    <>
      <Modal.Body>
        <InputPassword<PasswordFormInputs>
          label="Nova senha"
          name="newPassword"
          required
        />
        <InputPassword<PasswordFormInputs>
          label="Confirmar senha"
          name="confirmPassword"
          required
        />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
      />
    </>
  );
}
