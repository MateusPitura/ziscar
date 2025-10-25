/**
 * Auto-generated enums from Prisma schema
 * DO NOT EDIT MANUALLY - Run `npm run generate:enums` to regenerate
 */

export enum RoleType {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
}

export enum Resources {
  USERS = "USERS",
  VEHICLES = "VEHICLES",
  STORES = "STORES",
  VEHICLE_PURCHASE = "VEHICLE_PURCHASE",
  VEHICLE_EXPENSE = "VEHICLE_EXPENSE",
  VEHICLE_SALE = "VEHICLE_SALE",
  ACCOUNTS_PAYABLE = "ACCOUNTS_PAYABLE",
  ACCOUNTS_RECEIVABLE = "ACCOUNTS_RECEIVABLE",
  CUSTOMERS = "CUSTOMERS",
  REPORTS = "REPORTS",
}

export enum Actions {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum VehicleCategory {
  TRUCK = "TRUCK",
  CAR = "CAR",
  MOTORCYCLE = "MOTORCYCLE",
  BUS = "BUS",
  VAN = "VAN",
  PICKUP = "PICKUP",
}

export enum FuelType {
  DIESEL = "DIESEL",
  ELECTRIC = "ELECTRIC",
  ETHANOL = "ETHANOL",
  FLEX = "FLEX",
  GASOLINE = "GASOLINE",
  GNV = "GNV",
  HYBRID = "HYBRID",
}

export enum VehicleStatus {
  PURCHASED = "PURCHASED",
  IN_STOCK = "IN_STOCK",
  MAINTENANCE = "MAINTENANCE",
  SOLD = "SOLD",
}

export enum ExpenseCategory {
  AGENCY_FEES = "AGENCY_FEES",
  FUEL = "FUEL",
  FINE = "FINE",
  IPVA = "IPVA",
  LICENSING = "LICENSING",
  LOGISTICS = "LOGISTICS",
  MAINTENANCE = "MAINTENANCE",
  OTHER = "OTHER",
  INSURANCE = "INSURANCE",
}

export enum InstallmentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
}

export enum PaymentMethodReceivableType {
  BANK_SLIP = "BANK_SLIP",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  CASH = "CASH",
  DOC = "DOC",
  PIX = "PIX",
  TED = "TED",
  TRANSFER = "TRANSFER",
}

export enum PaymentMethodPayableType {
  BANK_SLIP = "BANK_SLIP",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  CASH = "CASH",
  DOC = "DOC",
  PIX = "PIX",
  TED = "TED",
}

export enum BrazilianState {
  AC = "AC",
  AL = "AL",
  AP = "AP",
  AM = "AM",
  BA = "BA",
  CE = "CE",
  DF = "DF",
  ES = "ES",
  GO = "GO",
  MA = "MA",
  MT = "MT",
  MS = "MS",
  MG = "MG",
  PA = "PA",
  PB = "PB",
  PR = "PR",
  PE = "PE",
  PI = "PI",
  RJ = "RJ",
  RN = "RN",
  RS = "RS",
  RO = "RO",
  RR = "RR",
  SC = "SC",
  SP = "SP",
  SE = "SE",
  TO = "TO",
}

// Const arrays for zod validation
export const ROLETYPE_VALUES = [RoleType.ADMIN, RoleType.SELLER] as const;
export const RESOURCES_VALUES = [Resources.USERS, Resources.VEHICLES, Resources.STORES, Resources.VEHICLE_PURCHASE, Resources.VEHICLE_EXPENSE, Resources.VEHICLE_SALE, Resources.ACCOUNTS_PAYABLE, Resources.ACCOUNTS_RECEIVABLE, Resources.CUSTOMERS, Resources.REPORTS] as const;
export const ACTIONS_VALUES = [Actions.CREATE, Actions.READ, Actions.UPDATE, Actions.DELETE] as const;
export const VEHICLECATEGORY_VALUES = [VehicleCategory.TRUCK, VehicleCategory.CAR, VehicleCategory.MOTORCYCLE, VehicleCategory.BUS, VehicleCategory.VAN, VehicleCategory.PICKUP] as const;
export const FUELTYPE_VALUES = [FuelType.DIESEL, FuelType.ELECTRIC, FuelType.ETHANOL, FuelType.FLEX, FuelType.GASOLINE, FuelType.GNV, FuelType.HYBRID] as const;
export const VEHICLESTATUS_VALUES = [VehicleStatus.PURCHASED, VehicleStatus.IN_STOCK, VehicleStatus.MAINTENANCE, VehicleStatus.SOLD] as const;
export const EXPENSECATEGORY_VALUES = [ExpenseCategory.AGENCY_FEES, ExpenseCategory.FUEL, ExpenseCategory.FINE, ExpenseCategory.IPVA, ExpenseCategory.LICENSING, ExpenseCategory.LOGISTICS, ExpenseCategory.MAINTENANCE, ExpenseCategory.OTHER, ExpenseCategory.INSURANCE] as const;
export const INSTALLMENTSTATUS_VALUES = [InstallmentStatus.PAID, InstallmentStatus.PENDING] as const;
export const PAYMENTMETHODRECEIVABLETYPE_VALUES = [PaymentMethodReceivableType.BANK_SLIP, PaymentMethodReceivableType.CREDIT_CARD, PaymentMethodReceivableType.DEBIT_CARD, PaymentMethodReceivableType.CASH, PaymentMethodReceivableType.DOC, PaymentMethodReceivableType.PIX, PaymentMethodReceivableType.TED, PaymentMethodReceivableType.TRANSFER] as const;
export const PAYMENTMETHODPAYABLETYPE_VALUES = [PaymentMethodPayableType.BANK_SLIP, PaymentMethodPayableType.CREDIT_CARD, PaymentMethodPayableType.DEBIT_CARD, PaymentMethodPayableType.CASH, PaymentMethodPayableType.DOC, PaymentMethodPayableType.PIX, PaymentMethodPayableType.TED] as const;
export const BRAZILIANSTATE_VALUES = [BrazilianState.AC, BrazilianState.AL, BrazilianState.AP, BrazilianState.AM, BrazilianState.BA, BrazilianState.CE, BrazilianState.DF, BrazilianState.ES, BrazilianState.GO, BrazilianState.MA, BrazilianState.MT, BrazilianState.MS, BrazilianState.MG, BrazilianState.PA, BrazilianState.PB, BrazilianState.PR, BrazilianState.PE, BrazilianState.PI, BrazilianState.RJ, BrazilianState.RN, BrazilianState.RS, BrazilianState.RO, BrazilianState.RR, BrazilianState.SC, BrazilianState.SP, BrazilianState.SE, BrazilianState.TO] as const;

// Type aliases for easier usage
export type RoleTypeType = keyof typeof RoleType;
export type ResourcesType = keyof typeof Resources;
export type ActionsType = keyof typeof Actions;
export type VehicleCategoryType = keyof typeof VehicleCategory;
export type FuelTypeType = keyof typeof FuelType;
export type VehicleStatusType = keyof typeof VehicleStatus;
export type ExpenseCategoryType = keyof typeof ExpenseCategory;
export type InstallmentStatusType = keyof typeof InstallmentStatus;
export type PaymentMethodReceivableTypeType = keyof typeof PaymentMethodReceivableType;
export type PaymentMethodPayableTypeType = keyof typeof PaymentMethodPayableType;
export type BrazilianStateType = keyof typeof BrazilianState;
