import { User } from "@/domains/global/types/model";
import { UserFormInputs } from "../types";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";
import selectAddressInfo from "@/domains/global/utils/selectAddressInfo";

export default function selectUserInfo(data: User): UserFormInputs {
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
    roleId: data.roleId?.toString() ?? "",
    address: selectAddressInfo(data.address),
  };
}
