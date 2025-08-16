import { PageablePayload } from "@/domains/global/types";
import { FetchCustomer } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectCustomersInfo(
  payload: PageablePayload<FetchCustomer>
): PageablePayload<FetchCustomer> {
  const itemsFiltered = [];

  for (const customer of payload.data) {
    itemsFiltered.push({
      ...customer,
      phone: applyMask(customer?.phone, "phone") ?? "",
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
  };
}
