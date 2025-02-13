import { UserFormInputs } from "../types";

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
  category: "admin",
};

export const userFilterDefaultValues = {
  page: 1,
  fullName: "",
  orderBy: "",
  category: [],
};
