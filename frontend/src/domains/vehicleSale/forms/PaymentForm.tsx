import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";

export default function PaymentForm(): ReactNode {
  return (
    <>
      <Input<VehicleSaleFormInputs> label="Entrada" name="payment.isUpfront" />
      <Input<VehicleSaleFormInputs>
        label="Parcelas"
        name="payment.installments"
      />
    </>
  );
}
