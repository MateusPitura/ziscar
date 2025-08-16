import { s } from "@shared/safeZod";
import { SchemaCustomerForm, SchemaCustomersFilterForm } from "../schemas";

export interface DisableCustomer {
  customerFullName: string;
  customerId: string;
}

export type CustomersFilterFormInputs = s.infer<typeof SchemaCustomersFilterForm>;

export type CustomerFormInputs = s.infer<typeof SchemaCustomerForm>;