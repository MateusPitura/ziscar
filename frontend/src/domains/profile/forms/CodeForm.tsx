import Form from "@/design-system/Form";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Form/Input";
import useDialogContext from "@/domains/global/hooks/useDialogContext";

const SchemaCodeForm = z.object({
  code: z.string().optional(),
});

type CodeFormInputs = z.infer<typeof SchemaCodeForm>;

interface CodeFormProps {
  defaultValues: Partial<CodeFormInputs>;
}

export default function CodeForm({ defaultValues }: CodeFormProps) {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<CodeFormInputs>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "Matrícula atualizada com sucesso",
  });

  return (
    <Form<CodeFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaCodeForm}
    >
      <CodeFormContent isPending={isPending} />
    </Form>
  );
}

interface CodeFormContentProps {
  isPending: boolean;
}

function CodeFormContent({ isPending }: CodeFormContentProps) {
  return (
    <>
      <Modal.Body>
        <Input<CodeFormInputs> name="code" label="Matrícula" />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
      />
    </>
  );
}
