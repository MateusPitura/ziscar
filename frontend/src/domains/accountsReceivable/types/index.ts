import { s } from "@shared/safeZod";
import { SchemaAccountsReceivableFilterForm } from "../schema";

export type AccountsReceivableFilterFormInputs = s.infer<typeof SchemaAccountsReceivableFilterForm>;