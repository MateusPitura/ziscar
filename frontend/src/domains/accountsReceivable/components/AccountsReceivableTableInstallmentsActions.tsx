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
  return installment.status === "PAID" ? (
    <Tooltip content="Visualizar método de pagamento">
      <Button
        variant="quaternary"
        iconLeft="Receipt"
        onClick={() => handleInstallmentToPaymentMethodInfo(installment)}
        resource="ACCOUNTS_RECEIVABLE"
        action="UPDATE"
        padding="none"
        data-cy={`button-edit-viewPaymentMethod-${installment.id}`}
      />
    </Tooltip>
  ) : (
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
