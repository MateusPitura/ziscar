import { User } from "@/domains/global/types/model";
import { UserFormInputs } from "../types";
import { applyMask } from "@/domains/global/utils/applyMask";
import selectAddressInfo from "@/domains/global/utils/selectAddressInfo";

export default function selectUserInfo(data: User): UserFormInputs {
  return {
    fullName: data.fullName,
    email: data.email,
    phone: applyMask(data.phone, "phone") ?? "",
    cpf: applyMask(data.cpf, "cpf") ?? "",
    roleId: data.roleId?.toString() ?? "",
    address: selectAddressInfo(data.address),
  };
}
