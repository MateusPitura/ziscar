import Button from "@/design-system/Button";
import { AccountPayableInstallment } from "@/domains/global/types/model";
import type { ReactNode } from "react";

interface AccountsPayableInstallmentsTableActionsProperties {
  installment: AccountPayableInstallment;
  handleInstallmentToPaymentMethodInfo: (
    installment: AccountPayableInstallment
  ) => void;
}

export default function AccountsPayableInstallmentsTableActions({
  installment,
  handleInstallmentToPaymentMethodInfo,
}: AccountsPayableInstallmentsTableActionsProperties): ReactNode {
  if (installment.paymentMethodPayables.length) return;

  return (
    <Button
      variant="quaternary"
      tooltipMessage="Adicionar método de pagamento"
      iconLeft="AddCard"
      onClick={() => handleInstallmentToPaymentMethodInfo(installment)}
      resource="ACCOUNTS_PAYABLE"
      action="READ"
      padding="none"
      data-cy={`button-edit-addPaymentMethod-${installment.id}`}
    />
  );
}
