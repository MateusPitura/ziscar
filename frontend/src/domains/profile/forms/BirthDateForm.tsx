import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/domains/global/components/Form";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Input";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";

const BirthDateSchema = z.object({
  birthDate: z.coerce
    .date({
      errorMap: (issue, { defaultError }) => ({
        message:
          issue.code === "invalid_date" ? "Data de nascimento inválida" : defaultError,
      }),
    })
    .min(new Date("1900-01-01"), { message: "Data de nascimento inválida" })
    .refine((date) => date < new Date(), {
      message: "Data de nascimento inválida",
    }),
});

interface BirthDateFormInputs {
  birthDate: string;
}

interface BirthDateFormProps {
  handleCloseModal: () => void;
  defaultValues: Partial<BirthDateFormInputs>;
}

export default function BirthDateForm({
  handleCloseModal,
  defaultValues,
}: BirthDateFormProps) {
  const { mutate, isPending } = useUpdateProfileInfo<BirthDateFormInputs>({
    onSuccessSubmit: handleCloseModal,
    snackbarTitle: "Data de nascimento atualizada com sucesso",
  });

  return (
    <Form<BirthDateFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={BirthDateSchema}
    >
      <BirthDateFormContent
        handleCloseModal={handleCloseModal}
        isPending={isPending}
      />
    </Form>
  );
}

interface BirthDateFormContentProps {
  handleCloseModal: () => void;
  isPending: boolean;
}

function BirthDateFormContent({
  handleCloseModal,
  isPending,
}: BirthDateFormContentProps) {
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
        <Input<BirthDateFormInputs>
          name="birthDate"
          label="Data de nascimento"
          type="date"
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
