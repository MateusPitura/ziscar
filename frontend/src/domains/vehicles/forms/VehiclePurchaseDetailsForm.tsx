import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { NewVehicleFormInputs } from "../types";

export default function VehiclePurchaseDetailsForm(): ReactNode {
  return (
    <>
      <Input<NewVehicleFormInputs>
        label="Data de compra"
        name="purchase.purchaseDate"
        type="date"
        required
      />
      <Input<NewVehicleFormInputs> label="Comprado de" name="purchase.paidTo" />
    </>
  );
}
