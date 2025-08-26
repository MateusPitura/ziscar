import { FetchAccountReceivableInstallment } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";

export default function selectAccountsReceivableInstallmentsInfo(
  payload: FetchAccountReceivableInstallment[]
): FetchAccountReceivableInstallment[] {
  const itemsFiltered = [];

  for (const accountReceivable of payload) {
    itemsFiltered.push({
      ...accountReceivable,
      dueDate: accountReceivable.dueDate
        ? safeFormat({ date: accountReceivable.dueDate, format: "dd/MM/yyyy" })
        : "",
      value: applyMask(accountReceivable.value, "money") ?? "",
    });
  }

  return itemsFiltered;
}
