import { AccountsPayableFilterFormInputs } from "@/domains/accountsPayable/types";
import { AccountsReceivableFilterFormInputs } from "@/domains/accountsReceivable/types";
import { CustomersFilterFormInputs } from "@/domains/customers/types";
import { StoresFilterFormInputs } from "@/domains/stores/types";
import { UsersFilterFormInputs } from "@/domains/users/types";
import { VehiclesFilterFormInputs } from "@/domains/vehicles/types";
import { BRAZILIANSTATE_VALUES } from "@shared/enums";
import { s } from "@shared/safeZod";
import {
  SchemaAddress,
  SchemaPayableInstallment,
  SchemaPayableUpfront,
  SchemaReceivableInstallment,
  SchemaReceivableUpfront,
} from "../schemas";

export interface Childrenable {
  children?: React.ReactNode;
}

export interface Pageable {
  page: number;
}

export type UnwrapArray<T> = T extends (infer U)[] ? U : T;

export interface DialogProps {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
  handleOpen: (state: boolean) => void;
}

export type Mask =
  | "phone"
  | "cpf"
  | "cep"
  | "cnpj"
  | "money"
  | "plateNumber"
  | "chassi"
  | "number";

export type QueryKeys =
  | "cepApi"
  | "ibgeApi"
  | "profile"
  | "permissions"
  | "brands"
  | "user"
  | "users"
  | "store"
  | "stores"
  | "customer"
  | "customers"
  | "vehicle"
  | "vehicles"
  | "vehicle-sale"
  | "vehicle-expense"
  | "vehicle-expenses"
  | "account-payable"
  | "accounts-payable"
  | "accounts-payable-installments"
  | "accounts-payable-payment-method"
  | "account-receivable"
  | "accounts-receivable"
  | "accounts-receivable-installments"
  | "accounts-receivable-payment-method"
  | "paid-to";

export interface UsersFilter extends UsersFilterFormInputs, Pageable {}
export interface StoresFilter extends StoresFilterFormInputs, Pageable {}
export interface CustomersFilter extends CustomersFilterFormInputs, Pageable {}
export interface AccountsReceivableFilter
  extends AccountsReceivableFilterFormInputs,
    Pageable {}
export interface AccountsPayableFilter
  extends AccountsPayableFilterFormInputs,
    Pageable {}
export interface VehiclesFilter extends VehiclesFilterFormInputs, Pageable {}

interface Summary {
  totalOverall: number;
  totalPaid: number;
  totalPending: number;
}

export interface PageablePayload<T> {
  data: T[];
  summary?: Summary;
  total: number;
}

export type DateFormats =
  | "yyyy-MM-dd"
  | "dd/MM/yyyy"
  | "HH-mm"
  | "dd-MM-yyyy"
  | "dd/MM/yyyy HH:mm";

export interface Options {
  value: string;
  label: string;
  description?: string;
}

export type AddressFormInputs = s.infer<typeof SchemaAddress>;

export type BrazilianState = (typeof BRAZILIANSTATE_VALUES)[number];

export type PayableInstallmentFormInputs = s.infer<
  typeof SchemaPayableInstallment
>;
export type ReceivableInstallmentFormInputs = s.infer<
  typeof SchemaReceivableInstallment
>;

type PayableUpfrontFormInputs = s.infer<typeof SchemaPayableUpfront>;
type ReceivableUpfrontFormInputs = s.infer<typeof SchemaReceivableUpfront>;

export interface PaymentFieldRuleData {
  payment: {
    upfront: PayableUpfrontFormInputs | ReceivableUpfrontFormInputs;
    installment:
      | PayableInstallmentFormInputs
      | ReceivableInstallmentFormInputs
      | null;
  };
}

export type ToString<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: string;
};
