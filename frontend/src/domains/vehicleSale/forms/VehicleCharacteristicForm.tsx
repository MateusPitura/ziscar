import Choice from "@/design-system/Form/Choice";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";

export default function VehicleCharacteristicForm(): ReactNode {
  return (
    <Choice>
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Câmbio automático"
        value="A"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Vidros elétricos"
        value="B"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Ar condicionado"
        value="C"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Travas elétricas"
        value="D"
      />
    </Choice>
  );
}
