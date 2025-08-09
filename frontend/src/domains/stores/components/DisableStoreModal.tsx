import type { ReactNode } from "react";
import { DisableStore } from "../types";
import { DialogProps } from "@/domains/global/types";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import Dialog from "@/design-system/Dialog";
import useFilterContext from "@/domains/global/hooks/useFilterContext";

interface DisableStoreModalProperties extends DisableStore, DialogProps {}

export default function DisableStoreModal({
  storeId,
  storeName,
  ...dialog
}: DisableStoreModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { handleStoresFilter } = useFilterContext();

  async function disableStore() {
    await safeFetch(`${BACKEND_URL}/store/${storeId}`, {
      method: "DELETE",
      body: { archivedAt: new Date().toISOString() },
      resource: "STORES",
      action: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: disableStore,
    onSuccess: () => {
      handleStoresFilter({ page: 1 });
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      showSuccessSnackbar({
        title: `Loja ${storeName} desativada com sucesso`,
      });
      dialog.closeDialog();
    },
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Desativar loja" />
      <Dialog.Body>
        <span className="text-body-medium text-neutral-700">
          Tem certeza que deseja desativar a loja
          <span className="font-bold">
            {BLANK}
            {storeName}
          </span>
          ? Ao desativar os registros relacionados a ela não serão mais
          acessíveis
        </span>
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Desativar"
        onClickPrimaryBtn={mutate}
        primaryBtnState={isPending ? "loading" : undefined}
        primaryBtnColor="red"
        primaryBtResource="STORES"
        primaryBtnAction="DELETE"
      />
    </Dialog>
  );
}
