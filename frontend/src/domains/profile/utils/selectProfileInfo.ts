import { User } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import selectAddressInfo from "@/domains/global/utils/selectAddressInfo";
import { UserFormInputs } from "@/domains/users/types";

export default function selectProfileInfo(data: User): UserFormInputs {
  return {
    fullName: data.fullName,
    email: data.email,
    phone: applyMask(data.phone, "phone") ?? "",
    cpf: applyMask(data.cpf, "cpf") ?? "",
    address: selectAddressInfo(data.address),
  };
}
