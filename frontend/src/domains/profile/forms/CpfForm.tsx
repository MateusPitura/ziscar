import Form from "@/domains/global/components/Form";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Input";
import Modal from "@/design-system/Modal";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { validateCpf } from "@/domains/global/utils/validateCpf";
import { removeMask } from "@/domains/global/utils/removeMask";

const SchemaCpfForm = z.object({
  cpf: z
    .string()
    .nonempty({ message: "CPF inválido" })
    .refine((cpf) => validateCpf(cpf), { message: "CPF inválido" })
    .transform((cpf) => removeMask(cpf, "CPF")),
});

type CpfFormInputs = z.infer<typeof SchemaCpfForm>;

interface CpfFormProps {
  handleCloseModal: () => void;
  defaultValues: Partial<CpfFormInputs>;
}

export default function CpfForm({
  handleCloseModal,
  defaultValues,
}: CpfFormProps) {
  const { isPending, mutate } = useUpdateProfileInfo<CpfFormInputs>({
    onSuccessSubmit: handleCloseModal,
    snackbarTitle: "CPF atualizado com sucesso",
  });

  return (
    <Form<CpfFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaCpfForm}
    >
      <CpfFormContent
        handleCloseModal={handleCloseModal}
        isPending={isPending}
      />
    </Form>
  );
}

interface CpfFormContentProps {
  handleCloseModal: () => void;
  isPending: boolean;
}

function CpfFormContent({ handleCloseModal, isPending }: CpfFormContentProps) {
  const {
    formState: { isDirty },
  } = useFormContext();

  const primaryBtnState = useMemo(() => {
    if (isPending) return "loading";
    if (!isDirty) return "disabled";
  }, [isPending, isDirty]);

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
        primaryBtnState={primaryBtnState}
        labelPrimaryBtn="Alterar"
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={handleCloseModal}
      />
    </>
  );
}
