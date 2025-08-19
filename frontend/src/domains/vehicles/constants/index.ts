import { FuelTypeType, VehicleCategoryType, VehicleStatusType } from "@shared/enums";
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
}

export const VehicleCategoryText: Record<VehicleCategoryType, string> = {
  CAR: "Carro",
  MOTORCYCLE: "Moto",
  TRUCK: "Caminhão",
  BUS: "Ônibus",
  VAN: "Van",
}
