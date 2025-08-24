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