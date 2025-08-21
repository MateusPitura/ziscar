import {
  ExpenseCategoryType,
  FuelTypeType,
  InstallmentStatus,
  VehicleCategoryType,
  VehicleStatusType,
} from "@shared/enums";
import { VehiclesFilterFormInputs } from "../types";

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
