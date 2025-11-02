import { todayFormatted } from "@/domains/global/utils/date";
import { InstallmentStatus, PaymentMethodReceivableType } from "@shared/enums";
import {
  AccountsReceivableFilterFormInputs,
  PaymentMethodFormInputs,
} from "../types";

export const paymentMethodDefaultValues: PaymentMethodFormInputs = {
  paymentDate: todayFormatted(),
  type: PaymentMethodReceivableType.CREDIT_CARD,
};

export const accountReceivableFilterDefaultValues: AccountsReceivableFilterFormInputs =
  {
    description: "",
    startDate: todayFormatted(),
    endDate: todayFormatted(),
    overallStatus: InstallmentStatus.PENDING,
  };

export const ACCOUNTS_RECEIVABLE_TABLE = {
  description: {
    label: "Descrição",
    colSpan: 3,
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
    colSpan: 1,
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
