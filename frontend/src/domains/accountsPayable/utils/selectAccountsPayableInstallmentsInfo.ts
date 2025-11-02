import { FetchAccountPayableInstallment } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { safeFormat } from "@/domains/global/utils/date";
import { isPast } from "date-fns";

export default function selectAccountsPayableInstallmentsInfo(
  payload: FetchAccountPayableInstallment[]
): (FetchAccountPayableInstallment & { isExpired: boolean })[] {
  const itemsFiltered = [];

  for (const accountPayable of payload) {
    const paymentMethods = [];
    for (const paymentMethod of accountPayable.paymentMethodPayables) {
      paymentMethods.push({
        ...paymentMethod,
        paymentDate: paymentMethod.paymentDate
          ? safeFormat({
              date: paymentMethod.paymentDate?.split("T")[0],
              format: "dd/MM/yyyy",
            })
          : "",
      });
    }

    itemsFiltered.push({
      ...accountPayable,
      dueDate: accountPayable.dueDate
        ? safeFormat({
            date: accountPayable.dueDate?.split("T")[0],
            format: "dd/MM/yyyy",
          })
        : "",
      value: applyMask(accountPayable.value, "money") ?? "",
      paymentMethodPayables: paymentMethods,
      isExpired:
        accountPayable.status === "PENDING" &&
        !!accountPayable.dueDate &&
        isPast(new Date(accountPayable.dueDate)),
    });
  }

  return itemsFiltered;
}
