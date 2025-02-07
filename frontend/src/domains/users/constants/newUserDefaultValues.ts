import { UserFormInputs } from "../schemas/users";

export const defaultValues: UserFormInputs = {
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
