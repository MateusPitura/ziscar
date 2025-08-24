import { FetchVehicleExpense } from "@/domains/global/types/model";
import { VehicleExpenseFormInputs } from "../types";

export default function selectVehicleExpenseInfo(
  payload: FetchVehicleExpense
): VehicleExpenseFormInputs {
  return {
    category: payload.category,
    competencyDate: payload.competencyDate,
    observations: payload.observations,
    payment: null
  };
}
