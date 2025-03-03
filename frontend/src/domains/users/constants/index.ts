import { UserFormInputs, UsersFilterFormInputs } from "../types";

export const userDefaultValues: UserFormInputs = {
  fullName: "",
  email: "",
  cellphone: "",
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
  category: "",
};

export const userFilterDefaultValues: UsersFilterFormInputs = {
  fullName: "",
  orderBy: "fullName",
  category: [],
};
