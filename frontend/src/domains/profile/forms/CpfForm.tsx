import Form from "@/design-system/Form";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Form/Input";
import Modal from "@/design-system/Modal";
import { removeMask } from "@/domains/global/utils/removeMask";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@/domains/global/schemas";

const SchemaCpfForm = s.object({
  cpf: s.cpf().transform((cpf) => removeMask(cpf, "cpf")),
});

type CpfFormInputs = s.infer<typeof SchemaCpfForm>;

interface CpfFormProps {
  defaultValues: Partial<CpfFormInputs>;
}

export default function CpfForm({ defaultValues }: CpfFormProps) {
  const { closeDialog } = useDialogContext();

  const { isPending, mutate } = useUpdateProfileInfo<CpfFormInputs>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "CPF atualizado com sucesso",
  });

  return (
    <Form<CpfFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaCpfForm}
    >
      <CpfFormContent isPending={isPending} />
    </Form>
  );
}

interface CpfFormContentProps {
  isPending: boolean;
}

function CpfFormContent({ isPending }: CpfFormContentProps) {
  return (
    <>
      <Modal.Body>
        <Input<CpfFormInputs>
          name="cpf"
          label="CPF"
          mask="cpf"
          maxLength={14}
          required
        />
      </Modal.Body>
      <Modal.Footer
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
        labelPrimaryBtn="Alterar"
      />
    </>
  );
}
