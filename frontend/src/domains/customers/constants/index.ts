import { CustomerFormInputs, CustomersFilterFormInputs } from "../types";

export const customerDefaultValues: CustomerFormInputs = {
  fullName: "",
  email: "",
  phone: "",
  cpf: "",
  address: [],
};

export const customerFilterDefaultValues: CustomersFilterFormInputs = {
  fullName: "",
  status: "active",
  startDate: "",
  endDate: "",
};

export const CUSTOMERS_TABLE = {
  name: {
    label: "Nome completo",
  },
  cpf: {
    label: "CPF",
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