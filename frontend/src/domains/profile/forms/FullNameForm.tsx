import type { ReactElement } from "react";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/domains/global/components/Form";
import Input from "@/design-system/Input";
import Modal from "@/design-system/Modal";

const SchemaFullNameForm = z.object({
  fullName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: "Nome completo inválido" }),
});

type FullNameFormInputs = z.infer<typeof SchemaFullNameForm>;

interface FullNameFormProperties {
  handleCloseModal: () => void;
  defaultValues: Partial<FullNameFormInputs>;
}

export default function FullNameForm({
  defaultValues,
  handleCloseModal,
}: FullNameFormProperties): ReactElement {
  const { handleSubmit } = useUpdateProfileInfo<FullNameFormInputs>({
    onSuccessSubmit: handleCloseModal,
    snackbarTitle: "Nome completo atualizado com sucesso",
  });

  return (
    <Form<FullNameFormInputs>
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      schema={SchemaFullNameForm}
    >
      <Modal.Body>
        <Input<FullNameFormInputs> name="fullName" label="Nome completo" />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        labelSecondaryBtn="Cancelar"
        onClickSecondaryBtn={handleCloseModal}
      />
    </Form>
  );
}
