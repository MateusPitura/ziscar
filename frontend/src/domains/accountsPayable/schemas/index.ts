import {
  INSTALLMENTSTATUS_VALUES,
  PAYMENTMETHODPAYABLETYPE_VALUES,
} from "@shared/enums";
import { s } from "@shared/safeZod";

export const SchemaAccountsPayableFilterForm = s
  .object({
    overallStatus: s.enumeration(INSTALLMENTSTATUS_VALUES),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaPaymentMethodForm = s.object({
  type: s.enumeration(PAYMENTMETHODPAYABLETYPE_VALUES),
  paymentDate: s.paymentDate(),
});
