import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";
import ColorPicker from "@/design-system/ColorPicker";

export default function VehicleForm(): ReactNode {
  return (
    <>
      <Input<VehicleSaleFormInputs> label="Modelo" name="vehicle.model" />
      <Input<VehicleSaleFormInputs>
        label="Preço de venda"
        name="vehicle.price"
      />
      <ColorPicker<VehicleSaleFormInputs>
        name="vehicle.color"
        label="Cor do veículo"
        required
      />
    </>
  );
}
