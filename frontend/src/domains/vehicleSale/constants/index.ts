import { InstallmentStatus } from "@shared/enums";
import { VehicleSaleFormInputs } from "../types";
import safeFormat from "@/domains/global/utils/safeFormat";

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
      saleDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
      installment: {
        dueDate: "",
        value,
        status: InstallmentStatus.PENDING,
        paymentDate: "",
        paymentMethod: "",
      },
    },
  };
}
