import type { ReactNode } from "react";
import Tooltip from "@/design-system/Tooltip";
import Button from "@/design-system/Button";
import { DisableVehicleExpense } from "../types";

interface VehicleExpenseTableActionsProperties {
  vehicleExpenseId: string;
  vehicleCategory: string;
  handleDisableVehicleExpenseInfo: (store: DisableVehicleExpense) => void;
}

export default function VehicleExpenseTableActions({
  vehicleExpenseId,
  vehicleCategory,
  handleDisableVehicleExpenseInfo,
}: VehicleExpenseTableActionsProperties): ReactNode {
  return (
    <>
      <Tooltip content="Editar">
        <Button
          variant="quaternary"
          iconLeft="Edit"
          //   onClick={() => navigate(`/stores/edit/${storeId}`)}
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
  );
}
