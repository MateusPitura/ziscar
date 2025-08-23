import {
  ActionsType,
  ExpenseCategoryType,
  FuelTypeType,
  InstallmentStatusType,
  PaymentMethodPayableTypeType,
  ResourcesType,
  VehicleCategoryType,
  VehicleStatusType,
} from "@shared/enums";
import { BrazilianState } from ".";

export type Address = {
  cep: string;
  number: string;
  street?: string;
  neighborhood?: string;
  city?: {
    ibgeCode: number;
    state: BrazilianState;
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
  installmentsNumber: number;
  vehicleSaleId: number;
}

export interface AccountReceivableInstallment {
  id: number;
  installmentSequence: number;
  dueDate: string;
  value: string;
  isRefund?: boolean;
  isUpfront?: boolean;
  status: InstallmentStatusType;
  paymentMethod?: PaymentMethodPayableTypeType;
}

export interface PaymentMethod {
  id: number;
  type: PaymentMethodPayableTypeType;
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
  fuelType: FuelTypeType;
  status: VehicleStatusType;
  storeId: number;
  chassiNumber: string;
  modelYear: string;
  yearOfManufacture: string;
  modelName: string;
  category: VehicleCategoryType;
  brandId: number;
  archivedAt?: Date;
}

export interface VehicleExpense {
  id: number;
  observations: string;
  category: ExpenseCategoryType;
  totalValue: string;
  competencyDate: string; // 🌠 isso não existe
  archivedAt?: Date;
}

export type FetchUser = Pick<
  User,
  "id" | "cpf" | "fullName" | "email" | "phone" | "archivedAt" | "roleId"
>;

export type FetchStore = Pick<
  Store,
  "id" | "name" | "cnpj" | "email" | "phone" | "archivedAt"
>;

export type FetchCustomer = Pick<
  Customer,
  "id" | "fullName" | "cpf" | "email" | "phone" | "archivedAt" | "cpf"
>;

export type FetchAccountReceivable = Pick<
  AccountReceivable,
  | "id"
  | "installmentsNumber"
  | "description"
  | "receivedFrom"
  | "totalValue"
  | "overallStatus"
  | "vehicleSaleId"
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
  | "paymentMethod"
>;

export type FetchVehicle = Pick<
  Vehicle,
  | "id"
  | "modelName"
  | "announcedPrice"
  | "plateNumber"
  | "modelYear"
  | "status"
  | "archivedAt"
>;

export type FetchVehicleExpense = Pick<
  VehicleExpense,
  | "id"
  | "observations"
  | "category"
  | "totalValue"
  | "competencyDate"
  | "archivedAt"
>;
