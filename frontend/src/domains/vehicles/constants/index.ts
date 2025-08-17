import { VehicleStatusType } from "@shared/enums";
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
