import { ReactElement } from "react";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/design-system/Form";
import { useIsFetching } from "@tanstack/react-query";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@shared/safeZod";
import AddressFields from "@/domains/global/components/AddressFields";
import Dialog from "@/design-system/Dialog";
import { SchemaAddress } from "@/domains/users/schemas";

const SchemaAddressForm = SchemaAddress;

type AddressFormInputs = s.infer<typeof SchemaAddressForm>;

interface AddressFormProps {
  defaultValues: Partial<AddressFormInputs>;
}

export default function AddressForm({
  defaultValues,
}: AddressFormProps): ReactElement {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<{
    address: AddressFormInputs;
  }>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "Endereço atualizado com sucesso",
  });

  function handleSubmit(data: AddressFormInputs) {
    mutate({ address: data });
  }

  return (
    <Form<AddressFormInputs>
      onSubmit={handleSubmit}
      schema={SchemaAddressForm}
      defaultValues={defaultValues}
      onlyDirty
    >
      <AddressFormContent isPending={isPending} />
    </Form>
  );
}

interface AddressFormContentProps {
  isPending: boolean;
}

function AddressFormContent({
  isPending,
}: AddressFormContentProps): ReactElement {
  const isFetching = useIsFetching({ queryKey: ["cepApi"] });

  return (
    <>
      <Dialog.Body>
        <AddressFields<AddressFormInputs> autoFocus />
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending || isFetching ? "loading" : undefined}
        dirty
      />
    </>
  );
}
