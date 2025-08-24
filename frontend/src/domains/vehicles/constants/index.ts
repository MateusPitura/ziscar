import { applyMask } from "@/domains/global/utils/applyMask";
import {
  ExpenseCategory,
  ExpenseCategoryType,
  FuelType,
  FuelTypeType,
  InstallmentStatus,
  VehicleCategory,
  VehicleCategoryType,
  VehicleStatus,
  VehicleStatusType,
} from "@shared/enums";
import {
  NewVehicleFormInputs,
  VehicleExpenseFormInputs,
  VehiclesFilterFormInputs,
} from "../types";

export const vehicleFilterDefaultValues: VehiclesFilterFormInputs = {
  startDate: "",
  endDate: "",
};

export const VehicleStatusText: Record<VehicleStatusType, string> = {
  DELIVERED: "Entregue",
  IN_STOCK: "Em Estoque",
  MAINTENANCE: "Em Manutenção",
  PURCHASED: "Comprado",
  SOLD: "Vendido",
};

export const FuelTypeText: Record<FuelTypeType, string> = {
  FLEX: "Flex",
  GASOLINE: "Gasolina",
  ETHANOL: "Etanol",
  GNV: "GNV",
  HYBRID: "Híbrido",
  ELECTRIC: "Elétrico",
  DIESEL: "Diesel",
};

export const VehicleCategoryText: Record<VehicleCategoryType, string> = {
  CAR: "Carro",
  MOTORCYCLE: "Moto",
  TRUCK: "Caminhão",
  BUS: "Ônibus",
  VAN: "Van",
};

export const ExpenseCategoryText: Record<ExpenseCategoryType, string> = {
  MAINTENANCE: "Manutenção",
  FUEL: "Combustível",
  INSURANCE: "Seguro",
  OTHER: "Outro",
  AGENCY_FEES: "Despachante",
  FINE: "Multa",
  IPVA: "IPVA",
  LICENSING: "Licenciamento",
  LOGISTICS: "Logística",
};

export const InstallmentStatusText: Record<InstallmentStatus, string> = {
  PAID: "Pago",
  PENDING: "Pendente",
};

export const INSTALMENT_STATUS = Object.values(InstallmentStatus).map(
  (status) => ({
    label: InstallmentStatusText[status],
    value: status,
  })
);

const currentYear = new Date().getFullYear();

export const YEARS_OF_MANUFACTURE = Array.from({ length: 100 }, (_, i) =>
  String(currentYear - i)
) as [string, ...string[]];

export const MODEL_YEARS = [
  String(currentYear + 1),
  ...YEARS_OF_MANUFACTURE,
] as [string, ...string[]];

export const YEARS_OF_MANUFACTURE_OPTIONS = YEARS_OF_MANUFACTURE.map(
  (year) => ({
    label: year,
    value: year,
  })
);

export const MODEL_YEARS_OPTIONS = [
  {
    label: String(currentYear + 1),
    value: String(currentYear + 1),
  },
  ...YEARS_OF_MANUFACTURE_OPTIONS,
];

export const newVehicleDefaultValues: NewVehicleFormInputs = {
  characteristics: {
    commonCharacteristics: [],
    newCharacteristics: [],
  },
  purchase: {
    paidTo: "",
    purchaseDate: "",
    installment: {
      dueDate: "",
      value: applyMask("0", "money") ?? "",
      status: InstallmentStatus.PENDING,
      paymentDate: "",
      paymentMethod: "",
    },
  },
  vehicle: {
    kilometers: "0",
    plateNumber: "",
    announcedPrice: applyMask("0", "money") ?? "",
    minimumPrice: applyMask("0", "money") ?? "",
    commissionValue: applyMask("0", "money") ?? "",
    color: "",
    fuelType: FuelType.FLEX,
    status: VehicleStatus.PURCHASED,
    chassiNumber: "",
    modelYear: "",
    yearOfManufacture: "",
    modelName: "",
    category: VehicleCategory.CAR,
    storeId: "",
    brandId: "",
  },
};

export const vehicleExpenseDefaultValues: VehicleExpenseFormInputs = {
  category: ExpenseCategory.MAINTENANCE,
  observations: "",
  competencyDate: "",
  payment: {
    dueDate: "",
    paymentDate: "",
    paymentMethod: "",
    status: InstallmentStatus.PENDING,
    value: applyMask("0", "money") ?? "",
  },
};
