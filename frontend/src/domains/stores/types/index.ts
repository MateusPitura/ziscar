import { s } from "@shared/safeZod";
import { SchemaStoreForm, SchemaStoresFilterForm } from "../schemas";

export interface DisableStore {
  storeName: string;
  storeId: string;
}

export type StoresFilterFormInputs = s.infer<typeof SchemaStoresFilterForm>;

export type StoreFormInputs = s.infer<typeof SchemaStoreForm>;