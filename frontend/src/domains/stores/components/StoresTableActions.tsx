import Button from "@/design-system/Button";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DisableStore } from "../types";

interface StoresTableActionsProperties {
  isActive?: boolean;
  storeId: string;
  name: string;
  handleDisableStoreInfo: (store: DisableStore) => void;
}

export default function StoresTableActions({
  storeId,
  name,
  isActive,
  handleDisableStoreInfo,
}: StoresTableActionsProperties): ReactNode {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function enableStore() {
    await safeFetch(`${BACKEND_URL}/store/${storeId}`, {
      method: "DELETE",
      body: { archivedAt: null },
      resource: "STORES",
      action: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: enableStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      showSuccessSnackbar({
        title: `Loja ${name} ativada com sucesso`,
      });
    },
  });

  return isActive ? (
    <>
      <Button
        tooltipMessage="Editar"
        variant="quaternary"
        iconLeft="Edit"
        onClick={() => navigate(`/stores/edit/${storeId}`)}
        resource="STORES"
        action="UPDATE"
        padding="none"
        data-cy={`button-edit-store-${storeId}`}
      />
      <Button
        tooltipMessage="Desativar"
        variant="primary"
        iconLeft="Delete"
        color="red"
        padding="none"
        onClick={() =>
          handleDisableStoreInfo({
            storeName: name,
            storeId,
          })
        }
        resource="STORES"
        action="DELETE"
        data-cy={`button-disable-store-${storeId}`}
      />
    </>
  ) : (
    <Button
      tooltipMessage="Ativar"
      variant="quaternary"
      onClick={mutate}
      state={isPending ? "loading" : undefined}
      resource="STORES"
      action="DELETE"
      padding="none"
      iconLeft="ToggleOn"
      data-cy={`button-enable-store-${storeId}`}
    />
  );
}
