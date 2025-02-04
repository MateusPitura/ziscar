import Form from "@/design-system/Form";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Form/Input";
import Modal from "@/design-system/Modal";
import { validateCpf } from "@/domains/global/utils/validateCpf";
import { removeMask } from "@/domains/global/utils/removeMask";
import useDialogContext from "@/domains/global/hooks/useDialogContext";

const SchemaCpfForm = z.object({
  cpf: z
    .string()
    .nonempty({ message: "CPF inválido" })
    .refine((cpf) => validateCpf(cpf), { message: "CPF inválido" })
    .transform((cpf) => removeMask(cpf, "CPF")),
});

type CpfFormInputs = z.infer<typeof SchemaCpfForm>;

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
          mask="CPF"
          maxLength={14}
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
