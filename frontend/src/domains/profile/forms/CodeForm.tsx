import Form from "@/design-system/Form";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Form/Input";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@shared/safeZod";
import Dialog from "@/design-system/Dialog";
import { SchemaUserForm } from "@/domains/users/schemas";

const SchemaCodeForm = SchemaUserForm.pick({
  code: true,
});

type CodeFormInputs = s.infer<typeof SchemaCodeForm>;

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
      <Dialog.Body>
        <Input<CodeFormInputs>
          name="code"
          label="Matrícula"
          autoSelect={false}
          autoFocus
        />
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
      />
    </>
  );
}
