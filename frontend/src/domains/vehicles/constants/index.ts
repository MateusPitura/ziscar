import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";
import {
  ExpenseCategory,
  ExpenseCategoryType,
  FuelType,
  FuelTypeType,
  InstallmentStatus,
  VehicleCategory,
  VehicleCategoryType,
  VehicleStatus,
} from "@shared/enums";
import { VehicleStatusForFilterType } from "@shared/types";
import {
  VehicleExpenseFormInputs,
  VehicleFormInputs,
  VehiclesFilterFormInputs,
} from "../types";

export const vehicleFilterDefaultValues: VehiclesFilterFormInputs = {
  startDate: "",
  endDate: "",
  storeId: "",
  brandId: "",
  status: "",
  category: "",
  modelYear: "",
  yearOfManufacture: "",
  modelName: "",
  plateNumber: "",
  announcedPriceMin: "",
  announcedPriceMax: "",
};

export const VehicleStatusText: Record<VehicleStatusForFilterType, string> = {
  IN_STOCK: "Em Estoque",
  MAINTENANCE: "Em Manutenção",
  PURCHASED: "Comprado",
  INACTIVE: "Inativo",
};

export const VehicleStatusTextForSale: Record<VehicleStatus, string> = {
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
  PICKUP: "Caminhonete",
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

export const vehicleDefaultValues: VehicleFormInputs = {
  characteristics: {
    commonCharacteristics: [],
    newCharacteristics: [],
  },
  payment: {
    paidTo: "",
    purchaseDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
    upfront: [],
    installment: {
      dueDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
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
  payment: {
    category: ExpenseCategory.MAINTENANCE,
    observations: "",
    competencyDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
    upfront: [],
    installment: vehicleDefaultValues.payment.installment,
  },
};

export const defaultCommonCharacteristics = [
  "Direção hidráulica",
  "Vidros elétricos",
  "Ar condicionado",
  "Travas elétricas",
  "Câmera de ré",
  "Air bag",
  "Rodas de liga leve",
];

export const VEHICLES_TABLE = {
  model: {
    label: "Modelo",
  },
  plate: {
    label: "Placa",
    colSpan: 1,
  },
  year: {
    label: "Ano do modelo",
    colSpan: 1,
  },
  price: {
    label: "Preço anunciado",
    colSpan: 1,
  },
  status: {
    label: "Status",
    colSpan: 1,
  },
} as const;

export const VEHICLES_EXPENSES_TABLE = {
  competencyDate: {
    label: "Data de competência",
  },
  observations: {
    label: "Observações",
  },
  category: {
    label: "Categoria",
  },
  totalValue: {
    label: "Valor",
    colSpan: 1,
  },
} as const;
