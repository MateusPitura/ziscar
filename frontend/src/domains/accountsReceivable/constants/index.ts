import safeFormat from "@/domains/global/utils/safeFormat";
import {
  AccountsReceivableFilterFormInputs,
  PaymentMethodFormInputs,
} from "../types";
import { InstallmentStatus, PaymentMethodReceivableType } from "@shared/enums";

export const paymentMethodDefaultValues: PaymentMethodFormInputs = {
  paymentDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
  type: PaymentMethodReceivableType.CREDIT_CARD,
};

export const accountReceivableFilterDefaultValues: AccountsReceivableFilterFormInputs =
  {
    startDate: "",
    endDate: "",
    overallStatus: InstallmentStatus.PENDING,
  };

