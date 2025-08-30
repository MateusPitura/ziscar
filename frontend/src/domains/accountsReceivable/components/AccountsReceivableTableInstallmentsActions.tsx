import Button from "@/design-system/Button";
import Tooltip from "@/design-system/Tooltip";
import type { ReactNode } from "react";
import { AccountReceivableInstallment } from "@/domains/global/types/model";

interface AccountsReceivableInstallmentsTableActionsProperties {
  installment: AccountReceivableInstallment;
  handleInstallmentToPaymentMethodInfo: (
    installment: AccountReceivableInstallment
  ) => void;
}

export default function AccountsReceivableInstallmentsTableActions({
  installment,
  handleInstallmentToPaymentMethodInfo,
}: AccountsReceivableInstallmentsTableActionsProperties): ReactNode {
  if (installment.status === "PAID") return;

  return (
    <Tooltip content="Adicionar método de pagamento">
      <Button
        variant="quaternary"
        iconLeft="AddCard"
        onClick={() => handleInstallmentToPaymentMethodInfo(installment)}
        resource="ACCOUNTS_RECEIVABLE"
        action="READ"
        padding="none"
        data-cy={`button-edit-addPaymentMethod-${installment.id}`}
      />
    </Tooltip>
  );
}
