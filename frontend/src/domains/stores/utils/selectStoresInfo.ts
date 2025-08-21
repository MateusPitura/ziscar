import { PageablePayload } from "@/domains/global/types";
import { FetchStore } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectStoresInfo(
  payload: PageablePayload<FetchStore>
): PageablePayload<FetchStore> {
  const itemsFiltered = [];

  for (const store of payload.data) {
    itemsFiltered.push({
      ...store,
      phone: applyMask(store?.phone, "phone") ?? "",
      cnpj: applyMask(store?.cnpj, "cnpj") ?? "",
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
  };
}
