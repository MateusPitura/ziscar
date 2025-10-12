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
import { FetchCustomer } from "@/domains/global/types/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import useVehicleSalePageContext from "../hooks/useVehicleSalePageContext";
import { VehicleSaleFormInputs } from "../types";
import selectCustomerInfo from "../utils/selectCustomerInfo";

interface NewCustomerModalProperties extends DialogProps {
  customerName: string;
}

export default function NewCustomerModal({
  customerName,
  ...dialog
}: NewCustomerModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { handleCustomer } = useVehicleSalePageContext();
  const { setValue } = useFormContext<VehicleSaleFormInputs>();

  async function createCustomer(
    data: CustomerFormInputsType
  ): Promise<FetchCustomer> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { address, ...rest } = data;

    const response = await safeFetch(`${BACKEND_URL}/customer`, {
      method: "POST",
      body: rest,
      resource: "CUSTOMERS",
      action: "CREATE",
    });

    return selectCustomerInfo(response);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomer,
    onSuccess: (response) => {
      showSuccessSnackbar({
        title: "Cliente criado com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      handleCustomer(response);
      setValue("customer.id", String(response.id));
      dialog.closeDialog();
    },
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Novo cliente" />
      <Dialog.Body>
        <Form<CustomerFormInputsType>
          defaultValues={{
            ...customerDefaultValues,
            fullName: customerName,
          }}
          schema={SchemaCustomerForm}
          onSubmit={mutate}
        >
          <CustomerFormInputs />
          <Dialog.Footer
            labelPrimaryBtn="Criar"
            className="px-0"
            dirty
            primaryBtnState={isPending ? "loading" : undefined}
            primaryBtnResource="CUSTOMERS"
            primaryBtnAction="CREATE"
          />
        </Form>
      </Dialog.Body>
    </Dialog>
  );
}
