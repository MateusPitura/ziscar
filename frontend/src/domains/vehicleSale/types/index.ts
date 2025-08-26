import { ToString } from "@/domains/global/types";
import {
  FetchCustomer,
  FetchVehicle,
  Vehicle,
} from "@/domains/global/types/model";
import { s } from "@shared/safeZod";
import { SchemaVehicleSaleForm } from "../schemas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schema = SchemaVehicleSaleForm();
export type VehicleSaleFormInputs = s.infer<typeof schema>;

export type CustomerForVehicleSale = FetchCustomer;

export type VehicleToString = ToString<
  Vehicle,
  "kilometers" | "announcedPrice" | "minimumPrice" | "commissionValue"
>;

export type FetchVehicleToString = ToString<
  FetchVehicle,
  "announcedPrice" | "modelYear"
>;
