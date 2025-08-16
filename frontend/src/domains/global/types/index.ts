import { StoresFilterFormInputs } from "@/domains/stores/types";
import { UsersFilterFormInputs } from "@/domains/users/types";
import { SchemaAddress } from "../schemas";
import { s } from "@shared/safeZod";
import { CustomersFilterFormInputs } from "@/domains/customers/types";
import { AccountsReceivableFilterFormInputs } from "@/domains/accountsReceivable/types";

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

export type Mask = "phone" | "cpf" | "cep" | "cnpj" | "money";

export type QueryKeys =
  | "cepApi"
  | "ibgeApi"
  | "profile"
  | "permissions"
  | "user"
  | "users"
  | "store"
  | "stores"
  | "customer"
  | "customers"
  | 'accounts-receivable'

export interface UsersFilter extends UsersFilterFormInputs, Pageable {}
export interface StoresFilter extends StoresFilterFormInputs, Pageable {}
export interface CustomersFilter extends CustomersFilterFormInputs, Pageable {}
export interface AccountsReceivableFilter extends AccountsReceivableFilterFormInputs, Pageable {}

export interface PageablePayload<T> {
  data: T[];
  total: number;
}

export type DateFormats = "yyyy-MM-dd" | "dd/MM/yyyy" | "HH-mm" | "dd-MM-yyyy";

export interface Options {
  value: string;
  label: string;
  description?: string;
}

export type AddressFormInputs = s.infer<typeof SchemaAddress>;

export type AccountStatus = "PAID" | "PENDING";