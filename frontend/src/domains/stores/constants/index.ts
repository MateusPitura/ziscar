import { StoreFormInputs, StoresFilterFormInputs } from "../types";

export const storeDefaultValues: StoreFormInputs = {
  name: "",
  email: "",
  phone: "",
  cnpj: "",
  address: [],
};

export const storeFilterDefaultValues: StoresFilterFormInputs = {
  name: "",
  status: "active",
  startDate: "",
  endDate: "",
};

export const STORES_TABLE = {
  name: {
    label: "Nome",
  },
  cnpj: {
    label: "CNPJ",
  },
  email: {
    label: "Email",
  },
  phone: {
    label: "Celular",
  },
  status: {
    label: "Status",
  },
} as const;