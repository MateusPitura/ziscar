import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";
import Choice from "@/design-system/Form/Choice";

export default function PaymentForm(): ReactNode {
  return (
    <>
      <Choice<VehicleSaleFormInputs> name="payment.isUpfront">
        <Choice.Checkbox label="Possui entrada" />
      </Choice>
      <Input<VehicleSaleFormInputs>
        label="Parcelas"
        name="payment.installments"
      />
    </>
  );
}
