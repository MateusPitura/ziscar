import { s } from "@shared/safeZod";
import { SchemaVehicleForm, SchemaVehiclesFilterForm } from "../schemas";

export interface DisableVehicle {
  plateNumber: string;
  vehicleId: string;
}

export type VehiclesFilterFormInputs = s.infer<typeof SchemaVehiclesFilterForm>;

export type VehicleFormInputs = s.infer<typeof SchemaVehicleForm>;