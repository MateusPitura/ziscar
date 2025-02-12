import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import Modal from "@/design-system/Modal";
import { baseUrl } from "@/domains/global/constants/requests";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { s } from "@/domains/global/schemas";
import { useMutation } from "@tanstack/react-query";
import type { ReactNode } from "react";

const SchemaForgetPasswordForm = s.object({
  email: s.email(),
});

type ForgetPasswordFormInputs = s.infer<typeof SchemaForgetPasswordForm>;

export default function ForgetPasswordForm(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const { closeDialog } = useDialogContext();

  async function handleForgetPassword(data: ForgetPasswordFormInputs) {
    await safeFetch(`${baseUrl}/forgetPassword`, {
      method: "post",
      body: data,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleForgetPassword,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Confira seu email",
        description: "Enviaremos um email para definir a senha",
      });
      closeDialog();
    },
  });

  return (
    <Form<ForgetPasswordFormInputs>
      defaultValues={{ email: "" }}
      schema={SchemaForgetPasswordForm}
      onSubmit={mutate}
    >
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <span className="text-body-large text-light-onSurface">
            Insira seu email para enviarmos as instruções para recuperar a senha
          </span>
          <Input<ForgetPasswordFormInputs>
            name="email"
            label="Email"
            required
          />
        </div>
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Enviar"
        dirty
        primaryBtnState={isPending ? "loading" : undefined}
      />
    </Form>
  );
}
