import Form from "@/design-system/Form";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Form/Input";
import { removeMask } from "@/domains/global/utils/removeMask";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@/domains/global/schemas";

const SchemaCellphoneForm = s.object({
  cellphone: s.cellphone().transform((cellphone) => removeMask(cellphone, "CELLPHONE")),
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
      <Modal.Body>
        <Input<CellphoneFormInputs>
          name="cellphone"
          label="Matrícula"
          mask="CELLPHONE"
          maxLength={15}
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
