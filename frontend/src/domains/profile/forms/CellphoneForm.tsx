import Form from "@/design-system/Form";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Form/Input";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@shared/safeZod";
import Dialog from "@/design-system/Dialog";

const SchemaCellphoneForm = s.object({
  cellPhone: s.cellphone(),
});

type CellphoneFormInputs = s.infer<typeof SchemaCellphoneForm>;

interface CellphoneFormProps {
  defaultValues: Partial<CellphoneFormInputs>;
}

export default function CellphoneForm({ defaultValues }: CellphoneFormProps) {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<CellphoneFormInputs>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "Celular atualizado com sucesso",
  });

  return (
    <Form<CellphoneFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaCellphoneForm}
    >
      <CellphoneFormContent isPending={isPending} />
    </Form>
  );
}

interface CellphoneFormContentProps {
  isPending: boolean;
}

function CellphoneFormContent({ isPending }: CellphoneFormContentProps) {
  return (
    <>
      <Dialog.Body>
        <Input<CellphoneFormInputs>
          name="cellPhone"
          label="Celular"
          mask="cellphone"
          maxLength={15}
          required
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
