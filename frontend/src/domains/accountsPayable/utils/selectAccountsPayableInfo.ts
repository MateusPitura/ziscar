import { PageablePayload } from "@/domains/global/types";
import { FetchAccountPayable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";

export default function selectAccountsPayableInfo(
  payload: PageablePayload<FetchAccountPayable>
): PageablePayload<FetchAccountPayable> {
  const itemsFiltered = [];

  for (const accountPayable of payload.data) {
    itemsFiltered.push({
      ...accountPayable,
      totalValue: applyMask(accountPayable.totalValue, "money") ?? "",
      date: accountPayable.date
        ? safeFormat({
            date: accountPayable.date.split("T")[0],
            format: "dd/MM/yyyy",
          })
        : "",
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
  };
}
