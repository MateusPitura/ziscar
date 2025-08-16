import { PageablePayload } from "@/domains/global/types";
import { FetchAccountReceivableInstallment } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";

export default function selectAccountsReceivableInstallmentsInfo(
  payload: PageablePayload<FetchAccountReceivableInstallment>
): PageablePayload<FetchAccountReceivableInstallment> {
  const itemsFiltered = [];

  for (const accountReceivable of payload.data) {
    itemsFiltered.push({
      ...accountReceivable,
      dueDate:
        safeFormat({ date: accountReceivable.dueDate, format: "dd/MM/yyyy" }) ??
        "",
      value: applyMask(accountReceivable.value, "money") ?? "",
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
  };
}
