import Button from "@/design-system/Button";
import Tooltip from "@/design-system/Tooltip";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AccountsReceivableInstallmentsTableActionsProperties {
    installmentId: string;
}

export default function AccountsReceivableInstallmentsTableActions({
    installmentId
}: AccountsReceivableInstallmentsTableActionsProperties): ReactNode {
  const navigate = useNavigate();

  return (
    // 🌠 payment methods/change status
    <Tooltip content="Visualizar detalhes">
      <Button
        variant="quaternary"
        iconLeft="Visibility"
        onClick={() => navigate(`/accounts-receivable/installments/${installmentId}`)}
        resource="ACCOUNTS_RECEIVABLE"
        action="UPDATE" // 🌠 change
        padding="none"
        data-cy={`button-edit-accountReceivable-${installmentId}`}
      />
    </Tooltip>
  );
}
