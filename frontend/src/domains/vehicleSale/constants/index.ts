import { InstallmentStatus } from "@shared/enums";
import { VehicleSaleFormInputs } from "../types";

interface VehicleSaleDefaultValuesProperties {
  value: string;
}

export function vehicleSaleDefaultValues({
  value,
}: VehicleSaleDefaultValuesProperties): VehicleSaleFormInputs {
  return {
    customer: { id: "" },
    payment: {
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
