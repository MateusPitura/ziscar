import { s } from "@shared/safeZod";
import { SchemaVehicleSaleForm } from "../schemas";

export type VehicleSaleFormInputs = s.infer<typeof SchemaVehicleSaleForm>;