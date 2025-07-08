import { UserFormInputs, UsersFilterFormInputs } from "../types";

export const userDefaultValues: UserFormInputs = {
  fullName: "",
  email: "",
  cellPhone: "",
  cpf: "",
  code: "",
  birthDate: "",
  address: {
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
  },
  roleId: "",
};

export const userFilterDefaultValues: UsersFilterFormInputs = {
  fullName: "",
  orderBy: "fullName",
  status: "active",
};
