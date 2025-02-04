import { type ReactElement } from "react";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Form/Input";
import Modal from "@/design-system/Modal";
import Form from "@/design-system/Form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@/domains/global/schemas";

const SchemaFullNameForm = s.object({
  fullName: s.fullName()
});

type FullNameFormInputs = s.infer<typeof SchemaFullNameForm>;

interface FullNameFormProperties {
  defaultValues: Partial<FullNameFormInputs>;
}

export default function FullNameForm({
  defaultValues,
}: FullNameFormProperties): ReactElement {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<FullNameFormInputs>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "Nome completo atualizado com sucesso",
  });

  return (
    <Form<FullNameFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaFullNameForm}
    >
      <FullNameFormContent isPending={isPending} />
    </Form>
  );
}

interface FullNameFormContentProps {
  isPending: boolean;
}

function FullNameFormContent({
  isPending,
}: FullNameFormContentProps): ReactElement {
  return (
    <>
      <Modal.Body>
        <Input<FullNameFormInputs>
          name="fullName"
          label="Nome completo"
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
