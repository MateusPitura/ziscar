import { User } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectProfileInfo(data: User): Omit<User, "id" | 'permissions'> {
  return {
    fullName: data.fullName,
    email: data.email,
    cellphone: applyMask(data.cellphone, "cellphone") ?? "",
    cpf: applyMask(data.cpf, "cpf") ?? "",
    code: data.code ?? "",
    birthDate: data.birthDate,
    address: {
      cep: applyMask(data.address?.cep, "cep") ?? "",
      number: data.address?.number ?? "",
      street: data.address?.street ?? "",
      complement: data.address?.complement ?? "",
      neighborhood: data.address?.neighborhood ?? "",
      city: data.address?.city ?? "",
      state: data.address?.state ?? "",
    },
  };
}
