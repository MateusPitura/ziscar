import { ActionsType, InstallmentStatusType, PaymentMethodReceivableTypeType, ResourcesType } from "@shared/enums";

export type Address = {
  cep: string;
  number: string;
  street?: string;
  neighborhood?: string;
  city?: {
    ibgeCode: number;
    state: string;
    name: string;
  };
};

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  cpf?: string;
  address?: Address;
  archivedAt?: Date;
  roleId?: string;
  permissions: Record<ResourcesType, Record<ActionsType, boolean>>;
}

export interface Store {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cnpj: string;
  address?: Address;
  archivedAt?: Date;
}

export interface Customer {
  id: number;
  fullName: string;
  email?: string;
  phone?: string;
  cpf: string;
  address?: Address;
  archivedAt?: Date;
}

export interface AccountReceivable {
  id: number;
  description?: string;
  receivedFrom?: string;
  totalValue?: string;
  overallStatus: InstallmentStatusType;
}

export interface AccountReceivableInstallment {
  id: number;
  installmentSequence: number;
  dueDate: string;
  value: string;
  isRefund?: boolean;
  isUpfront?: boolean;
  status: InstallmentStatusType;
}

export interface PaymentMethod {
  id: number;
  type: PaymentMethodReceivableTypeType;
  paymentDate: string;
}


export type FetchUser = Pick<
  User,
  "id" | "fullName" | "email" | "phone" | "archivedAt" | "roleId"
>;
export type FetchStore = Pick<
  Store,
  "id" | "name" | "email" | "phone" | "archivedAt"
>;
export type FetchCustomer = Pick<
  Customer,
  "id" | "fullName" | "email" | "phone" | "archivedAt" | "cpf"
>;
export type FetchAccountReceivable = Pick<
  AccountReceivable,
  "id" | "description" | "receivedFrom" | "totalValue" | "overallStatus"
>;
export type FetchAccountReceivableInstallment = Pick<
  AccountReceivableInstallment,
  "id" | "installmentSequence" | "dueDate" | "value" | "status" | "isRefund" | "isUpfront"
>;
