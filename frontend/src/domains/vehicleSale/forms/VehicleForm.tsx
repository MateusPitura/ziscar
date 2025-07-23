import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";

export default function VehicleForm(): ReactNode {
  return (
    <>
      <Input<VehicleSaleFormInputs> label="Modelo" name="vehicle.model" />
      <Input<VehicleSaleFormInputs>
        label="Preço de venda"
        name="vehicle.price"
      />
    </>
  );
}
