import Input from "@/design-system/Form/Input";
import Modal from "@/design-system/Modal";
import { useState, type ReactElement } from "react";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Form from "@/design-system/Form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@/domains/global/schemas";
import { passwordSchema } from "@/domains/global/schemas/schemas";

type PasswordFormInputs = s.infer<typeof passwordSchema>;

const defaultValues: PasswordFormInputs = {
  newPassword: "",
  confirmPassword: "",
};

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
      schema={passwordSchema}
      defaultValues={defaultValues}
    >
      <PasswordFormContent isPending={isPending} />
    </Form>
  );
}

interface PasswordFormContentProps {
  isPending: boolean;
}

export function PasswordFormContent({
  isPending,
}: PasswordFormContentProps): ReactElement {
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  function handleShowPassword(field: keyof typeof showPassword) {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  }

  return (
    <>
      <Modal.Body>
        <Input<PasswordFormInputs>
          label="Nova senha"
          name="newPassword"
          iconRight={
            showPassword.newPassword ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )
          }
          onClickIconRight={() => handleShowPassword("newPassword")}
          type={showPassword.newPassword ? "text" : "password"}
          required
        />
        <Input<PasswordFormInputs>
          label="Confirmar senha"
          name="confirmPassword"
          iconRight={
            showPassword.confirmPassword ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )
          }
          onClickIconRight={() => handleShowPassword("confirmPassword")}
          type={showPassword.confirmPassword ? "text" : "password"}
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
