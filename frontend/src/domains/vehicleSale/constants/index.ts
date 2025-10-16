import safeFormat from "@/domains/global/utils/safeFormat";
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
      saleDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
      upfront: [],
      installment: {
        dueDate: safeFormat({ date: new Date(), format: "yyyy-MM-dd" }),
        value,
        status: InstallmentStatus.PENDING,
        paymentDate: "",
        paymentMethod: "",
      },
    },
  };
}
