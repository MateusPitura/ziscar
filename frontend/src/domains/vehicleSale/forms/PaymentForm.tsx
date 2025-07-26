import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";
import Choice from "@/design-system/Form/Choice";

export default function PaymentForm(): ReactNode {
  return (
    <>
      <Choice>
        <Choice.Checkbox<VehicleSaleFormInputs>
          name="payment.isUpfront"
          label="Possui entrada"
          value={true}
        />
      </Choice>
      <Input<VehicleSaleFormInputs>
        label="Parcelas"
        name="payment.installments"
      />
    </>
  );
}
