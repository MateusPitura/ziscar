import type { ReactNode } from "react";
import { DisableCustomer } from "../types";
import { DialogProps } from "@/domains/global/types";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import Dialog from "@/design-system/Dialog";

interface DisableCustomerModalProperties extends DisableCustomer, DialogProps {}

export default function DisableCustomerModal({
  customerId,
  customerFullName,
  ...dialog
}: DisableCustomerModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { handleCustomersFilter } = useFilterContext();

  async function disableCustomer() {
    await safeFetch(`${BACKEND_URL}/customer/${customerId}`, {
      method: "DELETE",
      body: { archivedAt: new Date().toISOString() },
      resource: "CUSTOMERS",
      action: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: disableCustomer,
    onSuccess: () => {
      handleCustomersFilter({ page: 1 });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      showSuccessSnackbar({
        title: `Cliente ${customerFullName} desativado com sucesso`,
      });
      dialog.closeDialog();
    },
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Desativar cliente" />
      <Dialog.Body>
        <span className="text-body-medium text-neutral-700">
          Tem certeza que deseja desativar o cliente
          <span className="font-bold">
            {BLANK}
            {customerFullName}
          </span>
          ? Ao desativar os registros relacionados a ele não serão mais
          acessíveis
        </span>
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Desativar"
        onClickPrimaryBtn={mutate}
        primaryBtnState={isPending ? "loading" : undefined}
        primaryBtnColor="red"
        primaryBtnResource="CUSTOMERS"
        primaryBtnAction="DELETE"
      />
    </Dialog>
  );
}
