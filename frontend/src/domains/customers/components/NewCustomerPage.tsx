import { ContextHelperable } from "@/domains/contextHelpers/types";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import parseAddressToCreate from "@/domains/global/utils/parseAddressToCreate";
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { customerDefaultValues } from "../constants";
import CustomerForm from "../forms/CustomerForm";
import { CustomerFormInputs } from "../types";

export default function NewCustomerPage({ contextHelper}: ContextHelperable): ReactNode {
  const { safeFetch } = useSafeFetch();
  const isFetching = useIsFetching({ queryKey: ["cepApi"] });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccessSnackbar } = useSnackbar();

  async function createCustomer(data: CustomerFormInputs) {
    const { address: formAddress, ...rest } = data;

    const address = parseAddressToCreate({ address: formAddress });

    await safeFetch(`${BACKEND_URL}/customer`, {
      method: "POST",
      body: {
        ...rest,
        address,
      },
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
      navigate("/customers");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return (
    <CustomerForm
      defaultValues={customerDefaultValues}
      onSubmit={mutate}
      isPending={isPending || !!isFetching}
      headerTitle="Novo cliente"
      resource="CUSTOMERS"
      action="CREATE"
      contextHelper={contextHelper}
    />
  );
}
