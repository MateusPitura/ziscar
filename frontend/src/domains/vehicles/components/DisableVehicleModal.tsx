import type { ReactNode } from "react";
import { DisableVehicle } from "../types";
import { DialogProps } from "@/domains/global/types";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import Dialog from "@/design-system/Dialog";
import useFilterContext from "@/domains/global/hooks/useFilterContext";

interface DisableVehicleModalProperties extends DisableVehicle, DialogProps {}

export default function DisableVehicleModal({
  vehicleId,
  plateNumber,
  ...dialog
}: DisableVehicleModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { handleVehiclesFilter } = useFilterContext();

  async function disableVehicle() {
    await safeFetch(`${BACKEND_URL}/vehicle/${vehicleId}`, { // 🌠 MOCK
      method: "DELETE",
      body: { archivedAt: new Date().toISOString() },
      resource: "VEHICLES",
      action: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: disableVehicle,
    onSuccess: () => {
      handleVehiclesFilter({ page: 1 });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      showSuccessSnackbar({
        title: `Veículo ${plateNumber} desativado com sucesso`,
      });
      dialog.closeDialog();
    },
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Desativar veículo" />
      <Dialog.Body>
        <span className="text-body-medium text-neutral-700">
          Tem certeza que deseja desativar o veículo
          <span className="font-bold">
            {BLANK}
            {plateNumber}
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
        primaryBtnResource="VEHICLES"
        primaryBtnAction="DELETE"
      />
    </Dialog>
  );
}
