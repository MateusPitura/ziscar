import { User } from "@/domains/global/types/user";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectProfileInfo(data: User): Omit<User, "id"> {
  return {
    fullName: data.fullName,
    email: data.email,
    cellphone: applyMask(data.cellphone, "CELLPHONE") ?? "",
    cpf: applyMask(data.cpf, "CPF") ?? "",
    code: data.code ?? "",
    birthDate: data.birthDate,
    address: {
      cep: applyMask(data.address?.cep, "CEP") ?? "",
      number: data.address?.number ?? "",
      street: data.address?.street ?? "",
      complement: data.address?.complement ?? "",
      neighborhood: data.address?.neighborhood ?? "",
      city: data.address?.city ?? "",
      state: data.address?.state ?? "",
    },
  };
}
