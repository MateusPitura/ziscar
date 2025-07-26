import { User } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";
import selectAddressInfo from "@/domains/global/utils/selectAddressInfo";
import { UserFormInputs } from "@/domains/users/types";

export default function selectProfileInfo(data: User): UserFormInputs {
  return {
    fullName: data.fullName,
    email: data.email,
    cellPhone: applyMask(data.cellPhone, "cellphone") ?? "",
    cpf: applyMask(data.cpf, "cpf") ?? "",
    code: data.code ?? "",
    birthDate: data.birthDate
      ? safeFormat({
          date: data.birthDate,
          format: "yyyy-MM-dd",
        })
      : "",
    address: selectAddressInfo(data.address),
  };
}
