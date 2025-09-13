import { s } from "@shared/safeZod";
import { SchemaAccountsPayableFilterForm, SchemaPaymentMethodForm } from "../schemas";

export type AccountsPayableFilterFormInputs = s.infer<typeof SchemaAccountsPayableFilterForm>;

export type PaymentMethodFormInputs = s.infer<typeof SchemaPaymentMethodForm>;