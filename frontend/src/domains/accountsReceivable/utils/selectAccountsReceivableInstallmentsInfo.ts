import { FetchAccountReceivableInstallment } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";

export default function selectAccountsReceivableInstallmentsInfo(
  payload: FetchAccountReceivableInstallment[]
): FetchAccountReceivableInstallment[] {
  const itemsFiltered = [];

  for (const accountReceivable of payload) {
    const paymentMethods = [];
    for (const paymentMethod of accountReceivable.paymentMethodReceivables) {
      paymentMethods.push({
        ...paymentMethod,
        paymentDate: paymentMethod.paymentDate
          ? safeFormat({
              date: paymentMethod.paymentDate,
              format: "dd/MM/yyyy",
            })
          : "",
      });
    }

    itemsFiltered.push({
      ...accountReceivable,
      dueDate: accountReceivable.dueDate
        ? safeFormat({ date: accountReceivable.dueDate, format: "dd/MM/yyyy" })
        : "",
      value: applyMask(accountReceivable.value, "money") ?? "",
      paymentMethodReceivables: paymentMethods,
    });
  }

  return itemsFiltered;
}
