import Input from "@/design-system/Input";
import Form from "@/domains/global/components/Form";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import type { ReactElement } from "react";

interface DefaultValues {
  email?: string;
}

interface EmailFormProperties {
  formId: string;
  defaultValues: DefaultValues;
}

export default function EmailForm({
  formId,
  defaultValues,
}: EmailFormProperties): ReactElement {
  const { showSuccessSnackbar } = useSnackbar();

  function handleSubmit(data) {
    console.log("🌠 data: ", data);
    showSuccessSnackbar({
      title: "Email atualizado com sucesso",
    });
  }

  return (
    <Form onSubmit={handleSubmit} defaultValues={defaultValues} formId={formId}>
      <Input name="email" label="Email" />
    </Form>
  );
}
