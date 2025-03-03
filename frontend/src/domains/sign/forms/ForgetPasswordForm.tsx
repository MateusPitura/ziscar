import Dialog from "@/design-system/Dialog";
import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import { BASE_URL } from "@/domains/global/constants";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { s } from "@shared/safeZod";
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
    await safeFetch(`${BASE_URL}/forgetPassword`, {
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
      <Dialog.Body>
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
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Enviar"
        dirty
        primaryBtnState={isPending ? "loading" : undefined}
      />
    </Form>
  );
}
