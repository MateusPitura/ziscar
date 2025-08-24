import { API_URL, BACKEND_PORT } from "@shared/constants";
import {
  BrazilianState,
  PaymentMethodPayableType,
  PaymentMethodPayableTypeType,
  PaymentMethodReceivableType,
  PaymentMethodReceivableTypeType,
} from "@shared/enums";

export const BLANK = " ";

export const BACKEND_URL = import.meta.env.PROD
  ? API_URL
  : `http://localhost:${BACKEND_PORT}`;

export const AUTH_CHANNEL = {
  SIGNIN: "SIGN_IN",
  SIGNOUT: "SIGN_OUT",
};

export const DEFAULT_ROUTE = "/vehicles";

export const STATES = [
  { value: BrazilianState.AC, label: "Acre" },
  { value: BrazilianState.AL, label: "Alagoas" },
  { value: BrazilianState.AP, label: "Amapá" },
  { value: BrazilianState.AM, label: "Amazonas" },
  { value: BrazilianState.BA, label: "Bahia" },
  { value: BrazilianState.CE, label: "Ceará" },
  { value: BrazilianState.DF, label: "Distrito Federal" },
  { value: BrazilianState.ES, label: "Espírito Santo" },
  { value: BrazilianState.GO, label: "Goiás" },
  { value: BrazilianState.MA, label: "Maranhão" },
  { value: BrazilianState.MT, label: "Mato Grosso" },
  { value: BrazilianState.MS, label: "Mato Grosso do Sul" },
  { value: BrazilianState.MG, label: "Minas Gerais" },
  { value: BrazilianState.PA, label: "Pará" },
  { value: BrazilianState.PB, label: "Paraíba" },
  { value: BrazilianState.PR, label: "Paraná" },
  { value: BrazilianState.PE, label: "Pernambuco" },
  { value: BrazilianState.PI, label: "Piauí" },
  { value: BrazilianState.RJ, label: "Rio de Janeiro" },
  { value: BrazilianState.RN, label: "Rio Grande do Norte" },
  { value: BrazilianState.RS, label: "Rio Grande do Sul" },
  { value: BrazilianState.RO, label: "Rondônia" },
  { value: BrazilianState.RR, label: "Roraima" },
  { value: BrazilianState.SC, label: "Santa Catarina" },
  { value: BrazilianState.SP, label: "São Paulo" },
  { value: BrazilianState.SE, label: "Sergipe" },
  { value: BrazilianState.TO, label: "Tocantins" },
];

export const PREVIOUS_PAGE = -1;
export const CEP_LENGTH_WITH_MASK = 9;

export const PaymentMethodPayableText: Record<
  PaymentMethodPayableTypeType,
  string
> = {
  BANK_SLIP: "Boleto Bancário",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  DOC: "DOC",
  PIX: "Pix",
  TED: "TED",
};

export const PaymentMethodReceivableText: Record<
  PaymentMethodReceivableTypeType,
  string
> = {
  ...PaymentMethodPayableText,
  TRANSFER: "Transferência Bancária",
};

export const PAYMENT_METHODS_RECEIVABLE_TYPE_OPTIONS = Object.values(
  PaymentMethodReceivableType
).map((method) => ({
  label: PaymentMethodReceivableText[method],
  value: method,
}));

export const PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS = Object.values(
  PaymentMethodPayableType
).map((method) => ({
  label: PaymentMethodReceivableText[method],
  value: method,
}));
