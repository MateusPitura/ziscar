import { Store } from "@/domains/global/types/model";
import { StoreFormInputs } from "../types";
import { applyMask } from "@/domains/global/utils/applyMask";
import selectAddressInfo from "@/domains/global/utils/selectAddressInfo";

export default function selectStoreInfo(data: Store): StoreFormInputs {
  return {
    name: data.name,
    email: data.email ?? "",
    phone: applyMask(data.phone, "phone") ?? "",
    cnpj: applyMask(data.cnpj, "cnpj") ?? "",
    address: selectAddressInfo(data.address),
  };
}
