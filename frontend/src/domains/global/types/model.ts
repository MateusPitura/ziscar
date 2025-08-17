import { Action, Resource } from "@shared/types";
import {
  AccountStatus,
  FuelType,
  PaymentMethodType,
  VehicleCategory,
  VehicleStatus,
} from ".";

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
  permissions: Record<Resource, Record<Action, boolean>>;
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
  overallStatus: AccountStatus;
}

export interface AccountReceivableInstallment {
  id: number;
  installmentSequence: number;
  dueDate: string;
  value: string;
  isRefund?: boolean;
  isUpfront?: boolean;
  status: AccountStatus;
}

export interface PaymentMethod {
  id: number;
  type: PaymentMethodType;
  paymentDate: string;
}

export interface Vehicle {
  id: number;
  kilometers: number;
  plateNumber: string;
  announcedPrice: string;
  minimumPrice: string;
  commissionValue: string;
  color: string;
  fuelType: FuelType;
  status: VehicleStatus;
  storeId: number;
  chassiNumber: string;
  modelYear: string;
  yearOfManufacture: string;
  modelName: string;
  category: VehicleCategory;
  brandId: number;
  archivedAt?: Date;
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
  | "id"
  | "installmentSequence"
  | "dueDate"
  | "value"
  | "status"
  | "isRefund"
  | "isUpfront"
>;

export type FetchVehicle = Pick<
  Vehicle,
  "id" | "modelName" | "plateNumber" | "modelYear" | "status" | "archivedAt"
>;
