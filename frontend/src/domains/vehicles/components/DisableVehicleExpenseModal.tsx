import Dialog from "@/design-system/Dialog";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { DialogProps } from "@/domains/global/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { DisableVehicleExpense } from "../types";

interface DisableVehicleExpenseModalProperties
  extends DisableVehicleExpense,
    DialogProps {}

export default function DisableVehicleExpenseModal({
  vehicleExpenseId,
  vehicleCategory,
  ...dialog
}: DisableVehicleExpenseModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function disableVehicleExpense() {
    await safeFetch(
      `${BACKEND_URL}/vehicle-expense/${vehicleExpenseId}/archive`,
      {
        method: "PATCH",
        resource: "VEHICLE_EXPENSE",
        action: "DELETE",
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: disableVehicleExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-expenses"] });
      showSuccessSnackbar({
        title: `Gasto removido com sucesso`,
      });
      dialog.closeDialog();
    },
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Remover gasto" />
      <Dialog.Body>
        <span className="text-body-medium text-neutral-700">
          Tem certeza que deseja remover o gasto de
          <span className="font-bold">
            {BLANK}
            {vehicleCategory}
          </span>
          ? Ao remover ele não será mais acessível
        </span>
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Remover"
        onClickPrimaryBtn={mutate}
        primaryBtnState={isPending ? "loading" : undefined}
        primaryBtnColor="red"
        primaryBtnResource="VEHICLE_EXPENSE"
        primaryBtnAction="DELETE"
      />
    </Dialog>
  );
}
