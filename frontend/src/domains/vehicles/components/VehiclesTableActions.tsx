import Button from "@/design-system/Button";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { VehicleStatus } from "@shared/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DisableVehicle } from "../types";

interface VehiclesTableActionsProperties {
  isActive?: boolean;
  vehicleId: string;
  plateNumber: string;
  status: VehicleStatus;
  handleDisableVehicleInfo: (vehicle: DisableVehicle) => void;
}

export default function VehiclesTableActions({
  vehicleId,
  plateNumber,
  isActive,
  handleDisableVehicleInfo,
  status,
}: VehiclesTableActionsProperties): ReactNode {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function enableVehicle() {
    await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}/unarchive`, {
      method: "PATCH",
      resource: "VEHICLES",
      action: "DELETE",
    });
  }

  const { mutate: mutateEnableVehicle, isPending: isPendingEnableVehicle } =
    useMutation({
      mutationFn: enableVehicle,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        showSuccessSnackbar({
          title: `Veículo ${plateNumber} ativado com sucesso`,
        });
      },
    });

  async function editVehicle() {
    await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}`, {
      method: "PATCH",
      body: {
        status: VehicleStatus.IN_STOCK,
      },
      resource: "VEHICLES",
      action: "UPDATE",
    });
  }

  const { mutate: mutateEditVehicle, isPending: isPendingEditVehicle } = useMutation({
    mutationFn: editVehicle,
    onSuccess: () => {
      showSuccessSnackbar({
        title: `Veículo ${plateNumber} atualizado com sucesso`,
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicle", vehicleId],
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  return isActive ? (
    <>
      {status === VehicleStatus.IN_STOCK ? (
        <Button
          tooltipMessage="Vender"
          variant="quaternary"
          iconLeft="CurrencyExchange"
          onClick={() => navigate(`/vehicle-sale/new/${vehicleId}`)}
          resource="VEHICLE_SALE"
          action="CREATE"
          padding="none"
          data-cy={`button-vehicleSale-${vehicleId}`}
        />
      ) : (
        <Button
          tooltipMessage='Marcar como "Em Estoque"'
          variant="quaternary"
          iconLeft="NoCrash"
          onClick={mutateEditVehicle}
          resource="VEHICLES"
          action="UPDATE"
          padding="none"
          state={isPendingEditVehicle ? "loading" : undefined}
          data-cy={`button-makeAvailable-${vehicleId}`}
        />
      )}
      <Button
        tooltipMessage="Editar"
        variant="quaternary"
        iconLeft="Edit"
        onClick={() => navigate(`/vehicles/edit/${vehicleId}`)}
        resource="VEHICLES"
        action="UPDATE"
        padding="none"
        data-cy={`button-edit-vehicle-${vehicleId}`}
      />
      <Button
        tooltipMessage="Gastos"
        variant="quaternary"
        iconLeft="History"
        onClick={() => navigate(`/vehicles/expense/${vehicleId}`)}
        resource="VEHICLE_EXPENSE"
        action="READ"
        padding="none"
        data-cy={`button-vehicle-expense-${vehicleId}`}
      />
      <Button
        tooltipMessage="Desativar"
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
    </>
  ) : (
    <Button
      tooltipMessage="Ativar"
      variant="quaternary"
      onClick={mutateEnableVehicle}
      state={isPendingEnableVehicle ? "loading" : undefined}
      resource="VEHICLES"
      action="DELETE"
      padding="none"
      iconLeft="ToggleOn"
      data-cy={`button-enable-vehicle-${vehicleId}`}
    />
  );
}
