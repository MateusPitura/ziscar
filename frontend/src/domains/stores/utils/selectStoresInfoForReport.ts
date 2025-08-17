import { PageablePayload } from "@/domains/global/types";
import { FetchStore } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectStoresInfoForReport(
  payload: PageablePayload<FetchStore>
): Record<string, unknown>[] {
  const itemsFiltered = [];

  for (const store of payload.data) {
    itemsFiltered.push({
      ...store,
      phone: applyMask(store?.phone, "phone"),
    });
  }

  return itemsFiltered;
}
