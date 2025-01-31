import { type ReactElement } from "react";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Form/Input";
import Modal from "@/design-system/Modal";
import Form from "@/design-system/Form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";

const SchemaFullNameForm = z.object({
  fullName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: "Nome completo inválido" }),
});

type FullNameFormInputs = z.infer<typeof SchemaFullNameForm>;

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
