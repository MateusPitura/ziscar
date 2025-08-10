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
  orderBy: "name",
  status: "active",
  startDate: "",
  endDate: "",
};
