import { PageablePayload } from "@/domains/global/types";
import { FetchAccountReceivable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectAccountsReceivableInfo(
  payload: PageablePayload<FetchAccountReceivable>
): PageablePayload<FetchAccountReceivable> {
  const itemsFiltered = [];

  for (const accountReceivable of payload.data) {
    itemsFiltered.push({
      ...accountReceivable,
      totalValue: applyMask(accountReceivable.totalValue, "money") ?? "",
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
  };
}
