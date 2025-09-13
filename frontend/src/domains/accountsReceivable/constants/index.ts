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

export const ACCOUNTS_RECEIVABLE_TABLE = {
  description: {
    label: "Descrição",
  },
  date: {
    label: "Data de venda",
  },
  receivedFrom: {
    label: "Recebido de",
  },
  overallStatus: {
    label: "Status geral",
    colSpan: 1,
  },
  totalValue: {
    label: "Valor total",
  },
} as const;

export const ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE = {
  installmentSequence: {
    label: "Sequência",
    colSpan: 1,
  },
  dueDate: {
    label: "Data de vencimento",
  },
  paymentDate: {
    label: "Data de pagamento",
  },
  paymentMethod: {
    label: "Método de pagamento",
  },
  status: {
    label: "Status do pagamento",
  },
  value: {
    label: "Valor",
    colSpan: 1,
  },
} as const;