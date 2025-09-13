import { DialogProps } from "@/domains/global/types";
import { AccountPayableInstallment } from "@/domains/global/types/model";
import type { ReactNode } from "react";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
import ViewPaymentMethodModal from "./ViewPaymentMethodModal";

interface PaymentMethodModalProperties extends DialogProps {
  installment: AccountPayableInstallment | null;
}

export default function PaymentMethodModal({
  installment,
  ...dialog
}: PaymentMethodModalProperties): ReactNode {
  if (!installment) return;

  if (installment.paymentMethodPayables.length) {
    return <ViewPaymentMethodModal installment={installment} {...dialog} />;
  }

  return <AddPaymentMethodModal installment={installment} {...dialog} />;
}
