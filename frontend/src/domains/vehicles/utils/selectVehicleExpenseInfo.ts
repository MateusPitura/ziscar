import { FetchVehicleExpense } from "@/domains/global/types/model";
import { VehicleExpenseFormInputs } from "../types";

export default function selectVehicleExpenseInfo(
  payload: FetchVehicleExpense
): VehicleExpenseFormInputs {
  return {
    payment: {
      category: payload.category,
      competencyDate: payload.competencyDate?.split("T")?.[0],
      observations: payload.observations ?? "",
      upfront: [],
      installment: null,
    },
  };
}
