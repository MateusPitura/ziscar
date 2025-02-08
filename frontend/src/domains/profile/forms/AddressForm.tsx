import { ReactElement } from "react";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Form from "@/design-system/Form";
import Modal from "@/design-system/Modal";
import { useIsFetching } from "@tanstack/react-query";
import { removeMask } from "@/domains/global/utils/removeMask";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@/domains/global/schemas";
import AddressFields from "@/domains/global/components/AddressFields";
import { queryKeys } from "@/domains/global/types/queryKeys";

const SchemaAddressForm = s.addressSchema().extend({
  cep: s.cep().transform((cep) => removeMask(cep, "CEP")),
});

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
  const isFetching = useIsFetching({ queryKey: [queryKeys.CEP_API] });

  return (
    <>
      <Modal.Body>
        <AddressFields<AddressFormInputs> />
      </Modal.Body>
      <Modal.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending || isFetching ? "loading" : undefined}
        dirty
      />
    </>
  );
}
