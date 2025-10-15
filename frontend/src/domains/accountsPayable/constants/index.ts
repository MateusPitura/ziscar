import safeFormat from "@/domains/global/utils/safeFormat";
import { InstallmentStatus, PaymentMethodPayableType } from "@shared/enums";
import {
  AccountsPayableFilterFormInputs,
  PaymentMethodFormInputs,
} from "../types";

export const paymentMethodDefaultValues: PaymentMethodFormInputs = {
  paymentDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
  type: PaymentMethodPayableType.CREDIT_CARD,
};

export const accountPayableFilterDefaultValues: AccountsPayableFilterFormInputs =
  {
    description: "",
    startDate: "",
    endDate: "",
    overallStatus: InstallmentStatus.PENDING,
  };

export const ACCOUNTS_PAYABLE_TABLE = {
  description: {
    label: "Descrição",
  },
  date: {
    label: "Data de vencimento",
  },
  paidTo: {
    label: "Pago a",
  },
  overallStatus: {
    label: "Status geral",
    colSpan: 1,
  },
  totalValue: {
    label: "Valor total",
  },
} as const;

export const ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE = {
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