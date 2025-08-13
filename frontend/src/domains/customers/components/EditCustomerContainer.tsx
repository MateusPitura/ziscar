import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { Customer } from "@/domains/global/types/model";
import { useIsFetching, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomerFormInputs } from "../types";
import parseAddressToUpdate from "@/domains/global/utils/parseAddressToUpdate";
import Spinner from "@/design-system/Spinner";
import CustomerForm from "../forms/CustomerForm";
import selectCustomerInfo from "../utils/selectCustomerInfo";

export default function EditCustomerContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetchingCep = useIsFetching({ queryKey: ["cepApi"] });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { customerId } = useParams();

  async function getCustomer(): Promise<Customer> {
    return await safeFetch(`${BACKEND_URL}/customer/${customerId}`, {
      resource: "CUSTOMERS",
      action: "READ",
    });
  }

  const { data: customerData, isFetching } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: getCustomer,
    select: selectCustomerInfo,
  });

  async function editCustomer(data: CustomerFormInputs) {
    const { address, ...rest } = data;

    const addressPayload = parseAddressToUpdate({
      newAddress: address,
      oldAddress: customerData?.address,
    });

    await safeFetch(`${BACKEND_URL}/customer/${customerId}`, {
      method: "PATCH",
      body: {
        ...rest,
        ...(addressPayload && { address: addressPayload }),
      },
      resource: "CUSTOMERS",
      action: "UPDATE",
    });
  }

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editCustomer,
    onSuccess: async () => {
      showSuccessSnackbar({
        title: `Cliente ${customerData?.fullName} atualizado com sucesso`,
      });
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
      navigate("/customers");
    },
  });

  useEffect(
    () => () => {
      if (isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["customer", customerId],
        });
      }
    },
    [isSuccess, queryClient, customerId]
  );

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    customerData && (
      <CustomerForm
        defaultValues={customerData}
        onSubmit={mutate}
        isPending={isPending || !!isFetchingCep}
        headerTitle="Alterar cliente"
        isEdit
        resource="CUSTOMERS"
        action="UPDATE"
      />
    )
  );
}
