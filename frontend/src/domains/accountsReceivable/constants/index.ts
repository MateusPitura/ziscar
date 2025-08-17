import safeFormat from "@/domains/global/utils/safeFormat";
import {
  AccountsReceivableFilterFormInputs,
  PaymentMethodFormInputs,
} from "../types";
import { InstallmentStatus, PaymentMethodReceivableType, PaymentMethodReceivableTypeType } from "@shared/enums";

export const paymentMethodDefaultValues: PaymentMethodFormInputs = {
  paymentDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
  type: PaymentMethodReceivableType.TRANSFER,
};

export const accountReceivableFilterDefaultValues: AccountsReceivableFilterFormInputs =
  {
    startDate: "",
    endDate: "",
    overallStatus: InstallmentStatus.PENDING,
  };

export const PaymentMethodText: Record<PaymentMethodReceivableTypeType, string> = {
  BANK_SLIP: "Boleto Bancário",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  DOC: "DOC",
  PIX: "Pix",
  TED: "TED",
  TRANSFER: "Transferência Bancária",
};
