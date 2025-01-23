import Input from "@/design-system/Input";
import Modal from "@/design-system/Modal";
import Form from "@/domains/global/components/Form";
import { useMemo, useState, type ReactElement } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

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

interface PasswordFormProps {
  handleCloseModal: () => void;
}

export default function PasswordForm({
  handleCloseModal,
}: PasswordFormProps): ReactElement {
  const { mutate, isPending } = useUpdateProfileInfo<{
    password: PasswordFormInputs["newPassword"];
  }>({
    onSuccessSubmit: handleCloseModal,
    snackbarTitle: "Senha atualizada com sucesso",
    shouldInvalidateQuery: false,
  });

  function handleSubmit(data: PasswordFormInputs) {
    mutate({ password: data.newPassword });
  }

  return (
    <Form<PasswordFormInputs>
      onSubmit={handleSubmit}
      schema={SchemaPasswordForm}
      defaultValues={{ newPassword: "", confirmPassword: "" }}
    >
      <PasswordFormContent
        handleCloseModal={handleCloseModal}
        isPending={isPending}
      />
    </Form>
  );
}

interface PasswordFormContentProps {
  handleCloseModal: () => void;
  isPending: boolean;
}

export function PasswordFormContent({
  handleCloseModal,
  isPending,
}: PasswordFormContentProps): ReactElement {
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const {
    formState: { isDirty },
  } = useFormContext();

  const primaryBtnState = useMemo(() => {
    if (isPending) return "loading";
    if (!isDirty) return "disabled";
  }, [isPending, isDirty]);

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
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={handleCloseModal}
        primaryBtnState={primaryBtnState}
      />
    </>
  );
}
