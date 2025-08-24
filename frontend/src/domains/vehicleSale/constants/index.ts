import { applyMask } from "@/domains/global/utils/applyMask";
import { InstallmentStatus } from "@shared/enums";
import { VehicleSaleFormInputs } from "../types";

export const vehicleSaleDefaultValues: VehicleSaleFormInputs = {
  customer: { id: "" },
  vehicle: {
    id: "",
  },
  payment: {
    installment: {
      dueDate: "",
      value: applyMask("0", "money") ?? "",
      status: InstallmentStatus.PENDING,
      paymentDate: "",
      paymentMethod: "",
    },
  },
};
