import Button from "@/design-system/Button";
import Tooltip from "@/design-system/Tooltip";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AccountsPayableTableActionsProperties {
  accountPayableId: string;
}

export default function AccountsPayableTableActions({
  accountPayableId,
}: AccountsPayableTableActionsProperties): ReactNode {
  const navigate = useNavigate();

  return (
    <>
      <Tooltip content="Detalhes do pagamento">
        <Button
          variant="quaternary"
          iconLeft="ReceiptLong"
          onClick={() =>
            navigate(`/accounts-payable/${accountPayableId}/installments`)
          }
          resource="ACCOUNTS_PAYABLE"
          action="READ"
          padding="none"
          data-cy={`button-edit-accountPayable-${accountPayableId}`}
        />
      </Tooltip>
    </>
  );
}
