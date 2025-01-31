import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/design-system/Form";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Form/Input";
import useDialogContext from "@/domains/global/hooks/useDialogContext";

const BirthDateSchema = z.object({
  birthDate: z.coerce
    .date({
      errorMap: (issue, { defaultError }) => ({
        message:
          issue.code === "invalid_date"
            ? "Data de nascimento inválida"
            : defaultError,
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
  defaultValues: Partial<BirthDateFormInputs>;
}

export default function BirthDateForm({ defaultValues }: BirthDateFormProps) {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<BirthDateFormInputs>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "Data de nascimento atualizada com sucesso",
  });

  return (
    <Form<BirthDateFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={BirthDateSchema}
    >
      <BirthDateFormContent isPending={isPending} />
    </Form>
  );
}

interface BirthDateFormContentProps {
  isPending: boolean;
}

function BirthDateFormContent({ isPending }: BirthDateFormContentProps) {
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
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
        labelPrimaryBtn="Alterar"
      />
    </>
  );
}
