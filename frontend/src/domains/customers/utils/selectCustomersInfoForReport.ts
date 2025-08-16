import { PageablePayload } from "@/domains/global/types";
import { FetchCustomer } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectCustomersInfoForReport(
  payload: PageablePayload<FetchCustomer>
): Record<string, unknown>[] {
  const itemsFiltered = [];

  for (const customer of payload.data) {
    itemsFiltered.push({
      ...customer,
      phone: applyMask(customer?.phone, "phone") ?? "",
    });
  }

  return itemsFiltered;
}
