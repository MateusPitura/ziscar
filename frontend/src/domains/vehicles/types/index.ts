import { s } from "@shared/safeZod";
import { SchemaNewVehicleForm, SchemaVehiclesFilterForm } from "../schemas";

export interface DisableVehicle {
  plateNumber: string;
  vehicleId: string;
}

export type VehiclesFilterFormInputs = s.infer<typeof SchemaVehiclesFilterForm>;

export type NewVehicleFormInputs = s.infer<typeof SchemaNewVehicleForm>;