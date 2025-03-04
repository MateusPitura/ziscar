import { User } from "@/domains/global/types/model";
import { UserFormInputs } from "../types";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";

export default function selectUserInfo(data: User): UserFormInputs {
  return {
    fullName: data.fullName,
    email: data.email,
    cellphone: applyMask(data.cellPhone, "cellphone") ?? "",
    cpf: applyMask(data.cpf, "cpf") ?? "",
    code: data.code ?? "",
    birthDate: data.birthDate
      ? safeFormat({
          date: new Date(data.birthDate),
          format: "yyyy-MM-dd",
        })
      : "",
    category: data.category ?? "",
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
