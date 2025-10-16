import {
  ActionsType,
  ExpenseCategory,
  FuelType,
  InstallmentStatusType,
  PaymentMethodPayableTypeType,
  ResourcesType,
  VehicleCategory,
  VehicleStatus,
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
  totalValue: string;
  overallStatus: InstallmentStatusType;
  installmentsNumber: number;
  vehicleSaleId: number;
  date: string;
}

export interface AccountReceivableInstallment {
  id: number;
  installmentSequence: number;
  dueDate?: string;
  value: string;
  isRefund?: boolean;
  isUpfront?: boolean;
  status: InstallmentStatusType;
  paymentMethodReceivables: PaymentMethod[];
}

export interface AccountPayable {
  id: number;
  description?: string;
  paidTo?: string;
  totalValue: string;
  overallStatus: InstallmentStatusType;
  installmentsNumber: number;
  vehicleSaleId: number;
  date: string;
}

export interface AccountPayableInstallment {
  id: number;
  installmentSequence: number;
  dueDate?: string;
  value: string;
  isRefund?: boolean;
  isUpfront?: boolean;
  status: InstallmentStatusType;
  paymentMethodPayables: PaymentMethod[];
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
  announcedPrice: number;
  minimumPrice: number;
  commissionValue: number;
  color: string;
  fuelType: FuelType;
  status: VehicleStatus;
  store: {
    id: number;
    name: string;
  };
  chassiNumber: string;
  modelYear: number;
  yearOfManufacture: number;
  modelName: string;
  category: VehicleCategory;
  brand: {
    id: number;
    name: string;
  };
  vehicleCharacteristicValues: string[];
  archivedAt?: Date;
}

export interface VehicleWithPayment {
  vehicle: Vehicle;
  payment: {
    purchaseDate: string;
    paidTo?: string;
    value: string;
  } | null;
}

export interface VehicleExpense {
  id: number;
  observations: string;
  category: ExpenseCategory;
  totalValue: string;
  competencyDate: string;
  archivedAt?: Date;
}

export interface Brand {
  id: number;
  name: string;
}

export interface City {
  ibgeCode: number;
  name: string;
}

export interface PaidTo {
  paidTo: string | null;
  id: number;
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

export type FetchPaidTo = Pick<PaidTo, "paidTo" | "id">;

export type FetchModel = Pick<Vehicle, "id" | "modelName">;

export type FetchAccountPayable = Pick<
  AccountPayable,
  "id" | "date" | "description" | "paidTo" | "totalValue" | "overallStatus"
>;

export type FetchAccountPayableInstallment = Pick<
  AccountPayableInstallment,
  | "id"
  | "installmentSequence"
  | "dueDate"
  | "value"
  | "status"
  | "isRefund"
  | "isUpfront"
  | "paymentMethodPayables"
>;

export type FetchAccountReceivable = Pick<
  AccountReceivable,
  | "id"
  | "date"
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
  | "paymentMethodReceivables"
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

export type FetchBrand = Pick<Brand, "id" | "name">;
