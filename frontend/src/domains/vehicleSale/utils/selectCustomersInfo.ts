import { FetchCustomer } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectCustomersInfo(
  payload: FetchCustomer[]
): FetchCustomer[] {
  const itemsFiltered = [];

  for (const customer of payload) {
    itemsFiltered.push({
      ...customer,
      cpf: applyMask(customer?.cpf, "cpf") ?? "",
      phone: applyMask(customer?.phone, "phone") ?? "",
    });
  }

  return itemsFiltered;
}
