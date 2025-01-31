import Input from "@/design-system/Form/Input";
import { type ReactElement } from "react";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Modal from "@/design-system/Modal";
import Form from "@/design-system/Form";

const SchemaEmailForm = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type EmailFormInputs = z.infer<typeof SchemaEmailForm>;

interface EmailFormProps {
  handleCloseModal: () => void;
  defaultValues: Partial<EmailFormInputs>;
}

export default function EmailForm({
  handleCloseModal,
  defaultValues,
}: EmailFormProps): ReactElement {
  const { mutate, isPending } = useUpdateProfileInfo<EmailFormInputs>({
    onSuccessSubmit: handleCloseModal,
    snackbarTitle: "Email atualizado com sucesso",
  });

  return (
    <Form<EmailFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaEmailForm}
    >
      <EmailFormContent isPending={isPending} />
    </Form>
  );
}

interface EmailFormContentProps {
  isPending: boolean;
}

function EmailFormContent({ isPending }: EmailFormContentProps): ReactElement {
  return (
    <>
      <Modal.Body>
        <Input<EmailFormInputs> name="email" label="Email" required />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
      />
    </>
  );
}
