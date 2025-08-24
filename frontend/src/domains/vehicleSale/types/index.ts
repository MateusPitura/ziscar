import { FetchCustomer, FetchVehicle } from "@/domains/global/types/model";
import { s } from "@shared/safeZod";
import { SchemaVehicleSaleForm } from "../schemas";

export type VehicleSaleFormInputs = s.infer<typeof SchemaVehicleSaleForm>;

export type CustomerForVehicleSale = FetchCustomer;
export type VehicleForVehicleSale = FetchVehicle