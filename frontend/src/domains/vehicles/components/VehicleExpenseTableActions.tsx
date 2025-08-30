import type { ReactNode } from "react";
import Tooltip from "@/design-system/Tooltip";
import Button from "@/design-system/Button";
import { DisableVehicleExpense } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { BACKEND_URL } from "@/domains/global/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSnackbar from "@/domains/global/hooks/useSnackbar";

interface VehicleExpenseTableActionsProperties {
  vehicleExpenseId: string;
  vehicleCategory: string;
  isActive?: boolean;
  handleDisableVehicleExpenseInfo: (store: DisableVehicleExpense) => void;
}

export default function VehicleExpenseTableActions({
  vehicleExpenseId,
  vehicleCategory,
  isActive,
  handleDisableVehicleExpenseInfo,
}: VehicleExpenseTableActionsProperties): ReactNode {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { safeFetch } = useSafeFetch();
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbar();
  
  async function enableVehicleExpense() {
    await safeFetch(`${BACKEND_URL}/vehicle-expense/${vehicleExpenseId}`, { // 🌠 MOCK
      method: "DELETE",
      body: { archivedAt: null },
      resource: "VEHICLE_EXPENSE",
      action: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: enableVehicleExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle-expenses"] });
      showSuccessSnackbar({
        title: `Gasto de ${vehicleCategory} ativado com sucesso`,
      });
    },
  });

  return isActive ? (
    <>
      <Tooltip content="Editar">
        <Button
          variant="quaternary"
          iconLeft="Edit"
          onClick={() => navigate(`${pathname}/edit/${vehicleExpenseId}`)}
          resource="VEHICLE_EXPENSE"
          action="UPDATE"
          padding="none"
          data-cy={`button-edit-vehicle-expense-${vehicleExpenseId}`}
        />
      </Tooltip>
      <Tooltip content="Desativar">
        <Button
          variant="primary"
          iconLeft="Delete"
          color="red"
          padding="none"
          onClick={() => {
            handleDisableVehicleExpenseInfo({
              vehicleExpenseId,
              vehicleCategory,
            });
          }}
          resource="VEHICLE_EXPENSE"
          action="DELETE"
          data-cy={`button-disable-vehicle-expense-${vehicleExpenseId}`}
        />
      </Tooltip>
    </>
  ) : (
    <Tooltip content="Ativar">
      <Button
        variant="quaternary"
        onClick={mutate}
        state={isPending ? "loading" : undefined}
        resource="VEHICLE_EXPENSE"
        action="DELETE"
        padding="none"
        iconLeft="ToggleOn"
        data-cy={`button-enable-vehicle-expense-${vehicleExpenseId}`}
      />
    </Tooltip>
  );
}
