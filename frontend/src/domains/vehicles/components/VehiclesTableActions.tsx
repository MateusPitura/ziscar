import type { ReactNode } from "react";
import Tooltip from "@/design-system/Tooltip";
import Button from "@/design-system/Button";
import { BACKEND_URL } from "@/domains/global/constants";
import { useNavigate } from "react-router-dom";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DisableVehicle } from "../types";
import { VehicleSaleState } from "@/domains/global/types";

interface VehiclesTableActionsProperties {
  isActive?: boolean;
  vehicleId: string;
  plateNumber: string;
  handleDisableVehicleInfo: (vehicle: DisableVehicle) => void;
}

export default function VehiclesTableActions({
  vehicleId,
  plateNumber,
  isActive,
  handleDisableVehicleInfo,
}: VehiclesTableActionsProperties): ReactNode {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function enableVehicle() {
    await safeFetch(`${BACKEND_URL}/vehicle/${vehicleId}`, {
      method: "DELETE",
      body: { archivedAt: null },
      resource: "VEHICLES",
      action: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: enableVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      showSuccessSnackbar({
        title: `Veículo ${plateNumber} ativado com sucesso`,
      });
    },
  });

  return isActive ? (
    <>
      <Tooltip content="Vender">
        <Button
          variant="quaternary"
          iconLeft="CurrencyExchange"
          onClick={() => {
            const state: VehicleSaleState = { vehicleId };
            navigate(`/vehicle-sale`, {
              state,
            });
          }}
          resource="VEHICLE_SALE"
          action="CREATE"
          padding="none"
          data-cy={`button-vehicleSale-${vehicleId}`}
        />
      </Tooltip>
      <Tooltip content="Editar">
        <Button
          variant="quaternary"
          iconLeft="Edit"
          onClick={() => navigate(`/vehicles/edit/${vehicleId}`)}
          resource="VEHICLES"
          action="UPDATE"
          padding="none"
          data-cy={`button-edit-vehicle-${vehicleId}`}
        />
      </Tooltip>
      <Tooltip content="Gastos">
        <Button
          variant="quaternary"
          iconLeft="History"
          onClick={() => navigate(`/vehicles/expense/${vehicleId}`)}
          resource="VEHICLE_EXPENSE"
          action="READ"
          padding="none"
          data-cy={`button-vehicle-expense-${vehicleId}`}
        />
      </Tooltip>
      <Tooltip content="Desativar">
        <Button
          variant="primary"
          iconLeft="Delete"
          color="red"
          padding="none"
          onClick={() =>
            handleDisableVehicleInfo({
              plateNumber,
              vehicleId,
            })
          }
          resource="VEHICLES"
          action="DELETE"
          data-cy={`button-disable-vehicle-${vehicleId}`}
        />
      </Tooltip>
    </>
  ) : (
    <Tooltip content="Ativar">
      <Button
        variant="quaternary"
        onClick={mutate}
        state={isPending ? "loading" : undefined}
        resource="VEHICLES"
        action="DELETE"
        padding="none"
        iconLeft="ToggleOn"
        data-cy={`button-enable-vehicle-${vehicleId}`}
      />
    </Tooltip>
  );
}
