import { todayFormatted } from "@/domains/global/utils/date";
import { InstallmentStatus } from "@shared/enums";
import { VehicleSaleFormInputs } from "../types";

interface VehicleSaleDefaultValuesProperties {
  value: string;
  commissionValue: string;
}

export function vehicleSaleDefaultValues({
  value,
  commissionValue,
}: VehicleSaleDefaultValuesProperties): VehicleSaleFormInputs {
  return {
    customer: { id: "" },
    payment: {
      commissionValue,
      saleDate: todayFormatted(),
      upfront: [],
      installment: {
        dueDate: todayFormatted(),
        value,
        status: InstallmentStatus.PENDING,
        paymentDate: "",
        paymentMethod: "",
      },
    },
  };
}
