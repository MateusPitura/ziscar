import Form from "@/design-system/Form";
import { z } from "zod";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Form/Input";

const SchemaCodeForm = z.object({
  code: z.string().optional(),
});

type CodeFormInputs = z.infer<typeof SchemaCodeForm>;

interface CodeFormProps {
  handleCloseModal: () => void;
  defaultValues: Partial<CodeFormInputs>;
}

export default function CodeForm({
  handleCloseModal,
  defaultValues,
}: CodeFormProps) {
  const { mutate, isPending } = useUpdateProfileInfo<CodeFormInputs>({
    onSuccessSubmit: handleCloseModal,
    snackbarTitle: "Matrícula atualizada com sucesso",
  });

  return (
    <Form<CodeFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaCodeForm}
    >
      <CodeFormContent isPending={isPending} />
    </Form>
  );
}

interface CodeFormContentProps {
  isPending: boolean;
}

function CodeFormContent({ isPending }: CodeFormContentProps) {
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
        <Input<CodeFormInputs> name="code" label="Matrícula" />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={primaryBtnState}
      />
    </>
  );
}
