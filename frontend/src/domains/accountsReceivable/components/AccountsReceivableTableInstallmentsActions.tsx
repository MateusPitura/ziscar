import Button from "@/design-system/Button";
import { AccountReceivableInstallment } from "@/domains/global/types/model";
import type { ReactNode } from "react";

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
  if (installment.paymentMethodReceivables.length) return;

  return (
    <Button
      tooltipMessage="Adicionar método de pagamento"
      variant="quaternary"
      iconLeft="AddCard"
      onClick={() => handleInstallmentToPaymentMethodInfo(installment)}
      resource="ACCOUNTS_RECEIVABLE"
      action="READ"
      padding="none"
      data-cy={`button-edit-addPaymentMethod-${installment.id}`}
    />
  );
}
