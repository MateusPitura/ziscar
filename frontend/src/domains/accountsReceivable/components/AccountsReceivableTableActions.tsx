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
      <Tooltip content="Detalhes da venda">
        <Button
          variant="quaternary"
          iconLeft="CurrencyExchange"
          onClick={() => navigate(`/vehicle-sale/view/${vehicleSaleId}`)}
          resource="VEHICLE_SALE"
          action="READ"
          padding="none"
          data-cy={`button-view-vehicleSale-${vehicleSaleId}`}
        />
      </Tooltip>
      <Tooltip content="Detalhes do pagamento">
        <Button
          variant="quaternary"
          iconLeft="ReceiptLong"
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
