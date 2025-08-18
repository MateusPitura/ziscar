import { s } from "@shared/safeZod";
import { SchemaAccountsReceivableFilterForm, SchemaPaymentMethodForm } from "../schemas";

export type AccountsReceivableFilterFormInputs = s.infer<typeof SchemaAccountsReceivableFilterForm>;

export type PaymentMethodFormInputs = s.infer<typeof SchemaPaymentMethodForm>;