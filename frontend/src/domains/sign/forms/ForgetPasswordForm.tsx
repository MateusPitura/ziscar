import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import Modal from "@/design-system/Modal";
import { s } from "@/domains/global/schemas";
import type { ReactNode } from "react";

const SchemaForgetPasswordForm = s.object({
  email: s.email(),
});

type ForgetPasswordFormInputs = s.infer<typeof SchemaForgetPasswordForm>;

interface ForgetPasswordFormProperties {
  closeDialog: () => void;
}

export default function ForgetPasswordForm({
  closeDialog,
}: ForgetPasswordFormProperties): ReactNode {
  return (
    <Form<ForgetPasswordFormInputs>
      defaultValues={{ email: "" }}
      schema={SchemaForgetPasswordForm}
      onSubmit={() => {}}
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
        labelSecondaryBtn="Cancelar"
        dirty
        onClickSecondaryBtn={closeDialog}
      />
    </Form>
  );
}
