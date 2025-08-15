import Dialog from "@/design-system/Dialog";
import Form from "@/design-system/Form";
import { customerDefaultValues } from "@/domains/customers/constants";
import CustomerFormInputs from "@/domains/customers/forms/CustomerFormInputs";
import { SchemaCustomerForm } from "@/domains/customers/schemas";
import { CustomerFormInputs as CustomerFormInputsType } from "@/domains/customers/types";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { DialogProps } from "@/domains/global/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

interface NewCustomerModalProperties extends DialogProps {
  customerCpf: string;
}

export default function NewCustomerModal({
  customerCpf,
  ...dialog
}: NewCustomerModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function createCustomer(data: CustomerFormInputsType) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { address, ...rest } = data;

    await safeFetch(`${BACKEND_URL}/customer`, {
      method: "POST",
      body: rest,
      resource: "CUSTOMERS",
      action: "CREATE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Cliente criado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customersSearch"] });
      dialog.closeDialog()
    },
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Novo cliente" />
      <Dialog.Body>
        <Form<CustomerFormInputsType>
          defaultValues={{
            ...customerDefaultValues,
            cpf: customerCpf,
          }}
          schema={SchemaCustomerForm}
          onSubmit={mutate}
        >
          <CustomerFormInputs />
          <Dialog.Footer
            labelPrimaryBtn="Criar"
            labelSecondaryBtn="Cancelar"
            className="px-0"
            dirty
            primaryBtnState={isPending ? "loading" : undefined}
          />
        </Form>
      </Dialog.Body>
    </Dialog>
  );
}
