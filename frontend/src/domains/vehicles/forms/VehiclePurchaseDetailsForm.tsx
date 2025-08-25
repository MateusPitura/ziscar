import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleFormInputs } from "../types";

export default function VehiclePurchaseDetailsForm(): ReactNode {
  return (
    <>
      <Input<VehicleFormInputs>
        label="Data de compra"
        name="payment.purchaseDate"
        type="date"
        required
      />
      <Input<VehicleFormInputs> label="Comprado de" name="payment.paidTo" />
    </>
  );
}
