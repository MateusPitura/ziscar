import Button from "@/design-system/Button";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DisableCustomer } from "../types";

interface CustomersTableActionsProperties {
  isActive?: boolean;
  customerId: string;
  fullName: string;
  handleDisableCustomerInfo: (customer: DisableCustomer) => void;
}

export default function CustomersTableActions({
  customerId,
  fullName,
  isActive,
  handleDisableCustomerInfo,
}: CustomersTableActionsProperties): ReactNode {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function enableCustomer() {
    await safeFetch(`${BACKEND_URL}/customer/${customerId}`, {
      method: "DELETE",
      body: { archivedAt: null },
      resource: "CUSTOMERS",
      action: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: enableCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      showSuccessSnackbar({
        title: `Cliente ${fullName} ativado com sucesso`,
      });
    },
  });

  return isActive ? (
    <>
      <Button
        tooltipMessage="Editar"
        variant="quaternary"
        iconLeft="Edit"
        onClick={() => navigate(`/customers/edit/${customerId}`)}
        resource="CUSTOMERS"
        action="UPDATE"
        padding="none"
        data-cy={`button-edit-customer-${customerId}`}
      />
      <Button
        tooltipMessage="Desativar"
        variant="primary"
        iconLeft="Delete"
        color="red"
        padding="none"
        onClick={() =>
          handleDisableCustomerInfo({
            customerFullName: fullName,
            customerId,
          })
        }
        resource="CUSTOMERS"
        action="DELETE"
        data-cy={`button-disable-customer-${customerId}`}
      />
    </>
  ) : (
    <Button
      tooltipMessage="Ativar"
      variant="quaternary"
      onClick={mutate}
      state={isPending ? "loading" : undefined}
      resource="CUSTOMERS"
      action="DELETE"
      padding="none"
      iconLeft="ToggleOn"
      data-cy={`button-enable-customer-${customerId}`}
    />
  );
}
