import Input from "@/design-system/Form/Input";
import { type ReactElement } from "react";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Modal from "@/design-system/Modal";
import Form from "@/design-system/Form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@/domains/global/schemas";

const SchemaEmailForm = s.object({
  email: s.email(),
});

type EmailFormInputs = s.infer<typeof SchemaEmailForm>;

interface EmailFormProps {
  defaultValues: Partial<EmailFormInputs>;
}

export default function EmailForm({
  defaultValues,
}: EmailFormProps): ReactElement {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<EmailFormInputs>({
    onSuccessSubmit: closeDialog,
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
