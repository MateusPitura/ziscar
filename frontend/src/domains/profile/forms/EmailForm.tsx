import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import { useMemo, type ReactElement } from "react";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Modal from "@/design-system/Modal";
import { useFormContext } from "react-hook-form";

const SchemaEmailForm = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type EmailFormInputs = z.infer<typeof SchemaEmailForm>;

interface EmailFormProps {
  handleCloseModal: () => void;
  defaultValues: Partial<EmailFormInputs>;
}

export default function EmailForm({
  handleCloseModal,
  defaultValues,
}: EmailFormProps): ReactElement {
  const { mutate, isPending } = useUpdateProfileInfo<EmailFormInputs>({
    onSuccessSubmit: handleCloseModal,
    snackbarTitle: "Email atualizado com sucesso",
  });

  return (
    <Form<EmailFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaEmailForm}
    >
      <EmailFormContent
        handleCloseModal={handleCloseModal}
        isPending={isPending}
      />
    </Form>
  );
}

interface EmailFormContentProps {
  handleCloseModal: () => void;
  isPending: boolean;
}

function EmailFormContent({
  handleCloseModal,
  isPending,
}: EmailFormContentProps): ReactElement {
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
        <Input<EmailFormInputs> name="email" label="Email" />
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
