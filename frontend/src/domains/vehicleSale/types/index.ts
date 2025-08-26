import { FetchCustomer } from "@/domains/global/types/model";
import { s } from "@shared/safeZod";
import { SchemaVehicleSaleForm } from "../schemas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schema = SchemaVehicleSaleForm();
export type VehicleSaleFormInputs = s.infer<typeof schema>;

export type CustomerForVehicleSale = FetchCustomer;
