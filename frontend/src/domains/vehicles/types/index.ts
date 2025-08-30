import { s } from "@shared/safeZod";
import {
  SchemaVehicleExpenseForm,
  SchemaVehicleForm,
  SchemaVehiclesFilterForm,
} from "../schemas";

export interface DisableVehicle {
  plateNumber: string;
  vehicleId: string;
}

export interface DisableVehicleExpense {
  vehicleExpenseId: string;
  vehicleCategory?: string;
}

export type VehiclesFilterFormInputs = s.infer<typeof SchemaVehiclesFilterForm>;
export type VehicleFormInputs = s.infer<typeof SchemaVehicleForm>;
export type VehicleExpenseFormInputs = s.infer<typeof SchemaVehicleExpenseForm>;
