import { InstallmentStatus } from "@shared/enums";
import {
  PayableInstallmentFormInputs,
  ReceivableInstallmentFormInputs,
} from "../types";

interface FormatInstallmentProperties {
  installment: PayableInstallmentFormInputs | ReceivableInstallmentFormInputs;
  upfront: (PayableInstallmentFormInputs | ReceivableInstallmentFormInputs)[];
}

export default function formatInstallment({
  installment,
  upfront,
}: FormatInstallmentProperties) {
  const installments = [
    {
      installmentSequence: 2, // 🌠 FIX INSTALLMENT SEQUENCE, = 1
      dueDate: installment.dueDate,
      value: installment.value,
      isUpfront: false,
      paymentMethods:
        installment.status === InstallmentStatus.PAID
          ? [
              {
                type: installment.paymentMethod,
                value: installment.value,
                paymentDate: installment.paymentDate,
              },
            ]
          : null,
    },
  ];

  if (upfront.length) {
    installments.push({
      installmentSequence: 1, // 🌠 FIX INSTALLMENT SEQUENCE, = 0
      dueDate: upfront[0].dueDate,
      value: upfront[0].value,
      isUpfront: true,
      paymentMethods:
        upfront[0].status === InstallmentStatus.PAID
          ? [
              {
                type: upfront[0].paymentMethod,
                value: upfront[0].value,
                paymentDate: upfront[0].paymentDate,
              },
            ]
          : null,
    });
  }

  return installments;
}
