import { SEED_ROLE_ADMIN_ID } from "@shared/constants";
import { UserFormInputs, UsersFilterFormInputs } from "../types";

export const addressDefaultValues: UserFormInputs["address"][number] = {
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  cityIbgeCode: "",
  state: "",
};

export const userDefaultValues: UserFormInputs = {
  fullName: "",
  email: "",
  phone: "",
  cpf: "",
  address: [],
  roleId: String(SEED_ROLE_ADMIN_ID),
};

export const userFilterDefaultValues: UsersFilterFormInputs = {
  fullName: "",
  orderBy: "fullName",
  status: "active",
  startDate: "",
  endDate: "",
};
