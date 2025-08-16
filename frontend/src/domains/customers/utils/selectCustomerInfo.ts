import { Customer } from "@/domains/global/types/model";
import { CustomerFormInputs } from "../types";
import { applyMask } from "@/domains/global/utils/applyMask";
import selectAddressInfo from "@/domains/global/utils/selectAddressInfo";

export default function selectCustomerInfo(data: Customer): CustomerFormInputs {
  return {
    fullName: data.fullName,
    email: data.email ?? "",
    phone: applyMask(data.phone, "phone") ?? "",
    cpf: applyMask(data.cpf, "cpf") ?? "",
    address: selectAddressInfo(data.address),
  };
}
