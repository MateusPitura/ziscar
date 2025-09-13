import Button from "@/design-system/Button";
import Tooltip from "@/design-system/Tooltip";
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
    <Tooltip content="Adicionar método de pagamento">
      <Button
        variant="quaternary"
        iconLeft="AddCard"
        onClick={() => handleInstallmentToPaymentMethodInfo(installment)}
        resource="ACCOUNTS_PAYABLE"
        action="READ"
        padding="none"
        data-cy={`button-edit-addPaymentMethod-${installment.id}`}
      />
    </Tooltip>
  );
}
