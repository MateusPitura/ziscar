import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/design-system/Form";
import Modal from "@/design-system/Modal";
import Input from "@/design-system/Form/Input";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@/domains/global/schemas";

const BirthDateSchema = s.object({
  birthDate: s.birthDate(),
});

type BirthDateFormInputs = Omit<s.infer<typeof BirthDateSchema>, "birthDate"> & {
  birthDate: string;
};

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
          required
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
