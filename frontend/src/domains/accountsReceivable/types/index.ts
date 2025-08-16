import { s } from "@shared/safeZod";
import { SchemaAccountsReceivableFilterForm, SchemaPaymentMethodForm } from "../schema";

export type AccountsReceivableFilterFormInputs = s.infer<typeof SchemaAccountsReceivableFilterForm>;

export type PaymentMethodFormInputs = s.infer<typeof SchemaPaymentMethodForm>;