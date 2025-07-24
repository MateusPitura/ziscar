import Choice from "@/design-system/Form/Choice";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";

export default function VehicleCharacteristicForm(): ReactNode {
  return (
    <Choice>
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Câmbio automático"
        value="automaticTransmission"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Vidros elétricos"
        value="electricWindows"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Ar condicionado"
        value="airConditioning"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Travas elétricas"
        value="electricLocks"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Câmera de ré"
        value="rearViewCamera"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Air Bag"
        value="airBag"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.characteristics"
        label="Roda de liga leve"
        value="alloyWheel"
      />
    </Choice>
  );
}
