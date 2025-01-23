import Form from "@/domains/global/components/Form";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Input";
import { removeMask } from "@/domains/global/utils/removeMask";

const SchemaCellphoneForm = z.object({
  cellphone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{5}-\d{4}$/, "Celular inválido")
    .transform((cellphone) => removeMask(cellphone, "CELLPHONE")),
});

type CellphoneFormInputs = z.infer<typeof SchemaCellphoneForm>;

interface CellphoneFormProps {
  handleCloseModal: () => void;
  defaultValues: Partial<CellphoneFormInputs>;
}

export default function CellphoneForm({
  handleCloseModal,
  defaultValues,
}: CellphoneFormProps) {
  const { mutate, isPending } = useUpdateProfileInfo<CellphoneFormInputs>({
    onSuccessSubmit: handleCloseModal,
    snackbarTitle: "Celular atualizado com sucesso",
  });

  return (
    <Form<CellphoneFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaCellphoneForm}
    >
      <CellphoneFormContent
        handleCloseModal={handleCloseModal}
        isPending={isPending}
      />
    </Form>
  );
}

interface CellphoneFormContentProps {
  handleCloseModal: () => void;
  isPending: boolean;
}

function CellphoneFormContent({
  handleCloseModal,
  isPending,
}: CellphoneFormContentProps) {
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
        <Input<CellphoneFormInputs>
          name="cellphone"
          label="Matrícula"
          mask="CELLPHONE"
          maxLength={15}
        />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={handleCloseModal}
        primaryBtnState={primaryBtnState}
      />
    </>
  );
}
