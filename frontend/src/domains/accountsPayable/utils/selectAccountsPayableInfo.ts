import { PageablePayload } from "@/domains/global/types";
import { FetchAccountPayable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { safeFormat } from "@/domains/global/utils/date";
import { isPast } from "date-fns";

export default function selectAccountsPayableInfo(
  payload: PageablePayload<FetchAccountPayable>
): PageablePayload<FetchAccountPayable & { isExpired: boolean }> {
  const itemsFiltered = [];

  for (const accountPayable of payload.data) {
    const date = accountPayable.date?.split("T")[0];
    itemsFiltered.push({
      ...accountPayable,
      totalValue: applyMask(accountPayable.totalValue, "money") ?? "",
      date: accountPayable.date
        ? safeFormat({
            date,
            format: "dd/MM/yyyy",
          })
        : "",
      isExpired:
        accountPayable.overallStatus === "PENDING" && !!date && isPast(new Date(date)),
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
    summary: payload.summary,
  };
}
