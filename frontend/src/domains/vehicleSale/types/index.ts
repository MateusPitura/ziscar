import { s } from "@shared/safeZod";
import { SchemaVehicleSaleForm } from "../schemas";
import { Customer } from "@/domains/global/types/model";

export type VehicleSaleFormInputs = s.infer<typeof SchemaVehicleSaleForm>;

export type CustomerForVehicleSale = Omit<Customer, "address">;
