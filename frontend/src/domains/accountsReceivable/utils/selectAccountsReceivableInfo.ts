import { PageablePayload } from "@/domains/global/types";
import { FetchAccountReceivable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { safeFormat } from "@/domains/global/utils/date";

export default function selectAccountsReceivableInfo(
  payload: PageablePayload<FetchAccountReceivable>
): PageablePayload<FetchAccountReceivable> {
  const itemsFiltered = [];

  for (const accountReceivable of payload.data) {
    itemsFiltered.push({
      ...accountReceivable,
      totalValue: applyMask(accountReceivable.totalValue, "money") ?? "",
      date: accountReceivable.date
        ? safeFormat({
            date: accountReceivable.date.split("T")[0],
            format: "dd/MM/yyyy",
          })
        : "",
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
    summary: payload.summary,
  };
}
