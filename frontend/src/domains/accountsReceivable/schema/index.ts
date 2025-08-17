import {
  InstallmentStatus,
  PaymentMethodReceivableType
} from "@shared/enums";
import { s } from "@shared/safeZod";

export const SchemaAccountsReceivableFilterForm = s
  .object({
    overallStatus: s.radio([InstallmentStatus.PAID, InstallmentStatus.PENDING]),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaPaymentMethodForm = s.object({
  type: s.radio([
    PaymentMethodReceivableType.TRANSFER,
    PaymentMethodReceivableType.PIX,
    PaymentMethodReceivableType.BANK_SLIP,
    PaymentMethodReceivableType.CREDIT_CARD,
    PaymentMethodReceivableType.DEBIT_CARD,
    PaymentMethodReceivableType.TED,
    PaymentMethodReceivableType.DOC,
    PaymentMethodReceivableType.CASH,
  ]),
  paymentDate: s.paymentDate(),
});
