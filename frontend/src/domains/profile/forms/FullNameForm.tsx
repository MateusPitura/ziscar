import type { ReactElement } from "react";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/domains/global/components/Form";
import Input from "@/design-system/Input";

const SchemaFullNameForm = z.object({
  fullName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: "Nome completo inválido" }),
});

type FullNameFormInputs = z.infer<typeof SchemaFullNameForm>;

interface FullNameFormProperties {
  formId: string;
  onSuccessSubmit: () => void;
  defaultValues: Partial<FullNameFormInputs>;
}

export default function FullNameForm({
  defaultValues,
  formId,
  onSuccessSubmit,
}: FullNameFormProperties): ReactElement {
  const { handleSubmit } = useUpdateProfileInfo<FullNameFormInputs>({
    onSuccessSubmit,
    snackbarTitle: "Nome completo atualizado com sucesso",
  });

  return (
    <Form<FullNameFormInputs>
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      formId={formId}
      schema={SchemaFullNameForm}
    >
      <Input<FullNameFormInputs> name="fullName" label="Nome completo" />
    </Form>
  );
}
