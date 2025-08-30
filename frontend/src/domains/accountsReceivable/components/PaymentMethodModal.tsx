import { DialogProps } from "@/domains/global/types";
import type { ReactNode } from "react";
import { AccountReceivableInstallment } from "@/domains/global/types/model";
import ViewPaymentMethodModal from "./ViewPaymentMethodModal";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

interface PaymentMethodModalProperties extends DialogProps {
  installment: AccountReceivableInstallment | null;
}

export default function PaymentMethodModal({
  installment,
  ...dialog
}: PaymentMethodModalProperties): ReactNode {
  if (!installment) return;

  if (installment.paymentMethodReceivables.length) {
    return <ViewPaymentMethodModal installment={installment} {...dialog} />;
  }

  return <AddPaymentMethodModal installment={installment} {...dialog} />;
}
