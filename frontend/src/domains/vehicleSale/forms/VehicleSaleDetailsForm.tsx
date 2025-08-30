import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";

export default function VehicleSaleDetailsForm(): ReactNode {
  return (
    <>
      <Input<VehicleSaleFormInputs>
        label="Data de venda"
        name="payment.saleDate"
        type="date"
        required
      />
      <Input<VehicleSaleFormInputs>
        label="Valor da comissão"
        name="payment.commissionValue"
        mask="money"
      />
    </>
  );
}
