import { FetchCustomer } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectCustomerInfo(
  payload: FetchCustomer
): FetchCustomer {

  return {
    ...payload,
    cpf: applyMask(payload?.cpf, "cpf") ?? "",
    phone: applyMask(payload?.phone, "phone") ?? "",
  };
}
