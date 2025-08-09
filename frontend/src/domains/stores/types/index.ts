import { s } from "@shared/safeZod";
import { SchemaStoresFilterForm } from "../schemas";

export interface DisableStore {
  storeName: string;
  storeId: string;
}

export type StoresFilterFormInputs = s.infer<typeof SchemaStoresFilterForm>;