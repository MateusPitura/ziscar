import Button from "@/design-system/Button";
import Tooltip from "@/design-system/Tooltip";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AccountsReceivableTableActionsProperties {
  accountReceivableId: string;
  vehicleSaleId: string;
}

export default function AccountsReceivableTableActions({
  accountReceivableId,
  vehicleSaleId,
}: AccountsReceivableTableActionsProperties): ReactNode {
  const navigate = useNavigate();

  return (
    <>
      <Tooltip content="Visualizar venda">
        <Button
          variant="quaternary"
          iconLeft="DirectionsCar"
          onClick={() => navigate(`/vehicle-sale/${vehicleSaleId}`)}
          resource="VEHICLE_SALE"
          action="READ"
          padding="none"
          data-cy={`button-view-vehicleSale-${vehicleSaleId}`}
        />
      </Tooltip>
      <Tooltip content="Visualizar detalhes">
        <Button
          variant="quaternary"
          iconLeft="Visibility"
          onClick={() =>
            navigate(`/accounts-receivable/${accountReceivableId}/installments`)
          }
          resource="ACCOUNTS_RECEIVABLE"
          action="READ"
          padding="none"
          data-cy={`button-edit-accountReceivable-${accountReceivableId}`}
        />
      </Tooltip>
    </>
  );
}
