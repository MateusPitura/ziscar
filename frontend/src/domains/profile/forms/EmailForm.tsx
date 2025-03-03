import Input from "@/design-system/Form/Input";
import { type ReactElement } from "react";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/design-system/Form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@shared/safeZod";
import Dialog from "@/design-system/Dialog";

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
      <Dialog.Body>
        <Input<EmailFormInputs> name="email" label="Email" required />
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
      />
    </>
  );
}
