import { PageablePayload } from "@/domains/global/types";
import { FetchAccountReceivable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";

export default function selectAccountsReceivableInfoForReport(
  payload: PageablePayload<FetchAccountReceivable>
): Record<string, unknown>[] {
  const itemsFiltered = [];

  for (const accountReceivable of payload.data) {
    itemsFiltered.push({
      ...accountReceivable,
      totalValue: applyMask(accountReceivable.totalValue, "money") ?? "",
      overallStatus:
        accountReceivable.overallStatus === "PAID" ? "Pago" : "Pendente",
      date: accountReceivable.date
        ? safeFormat({
            date: accountReceivable.date.split("T")[0],
            format: "dd/MM/yyyy",
          })
        : "",
    });
  }

  return itemsFiltered;
}
