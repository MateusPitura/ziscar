import safeFormat from "@/domains/global/utils/safeFormat";
import {
  AccountsReceivableFilterFormInputs,
  PaymentMethodFormInputs,
} from "../types";
import { PaymentMethodType } from "@/domains/global/types";

export const paymentMethodDefaultValues: PaymentMethodFormInputs = {
  paymentDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
  type: "CREDIT_CARD",
};

export const accountReceivableFilterDefaultValues: AccountsReceivableFilterFormInputs =
  {
    startDate: "",
    endDate: "",
    overallStatus: "PENDING",
  };

export const PaymentMethodText: Record<PaymentMethodType, string> = {
  BANK_SLIP: "Boleto Bancário",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  DOC: "DOC",
  PIX: "Pix",
  TED: "TED",
  TRANSFER: "Transferência Bancária",
};
