import { s } from "@shared/safeZod";

export const SchemaAccountsReceivableFilterForm = s
  .object({
    overallStatus: s.radio(["PAID", "PENDING"]),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaPaymentMethodForm = s.object({
  type: s.radio([
    "TRANSFER",
    "PIX",
    "BANK_SLIP",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "TED",
    "DOC",
    "CASH",
  ]),
  paymentDate: s.paymentDate(),
});
