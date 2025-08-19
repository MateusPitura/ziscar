import { FetchVehicleExpense } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";

export default function selectVehicleExpensesInfo(
  payload: FetchVehicleExpense[]
): FetchVehicleExpense[] {
  const itemsFiltered = [];

  for (const expense of payload) {
    itemsFiltered.push({
      ...expense,
      totalValue: applyMask(expense.totalValue, "money") ?? "",
      competencyDate: safeFormat({
        date: expense.competencyDate,
        format: "dd/MM/yyyy",
      }),
    });
  }

  return itemsFiltered;
}
