import Choice from "@/design-system/Form/Choice";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";

export default function VehicleCommonCharacteristicForm(): ReactNode {
  return (
    <Choice>
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Câmbio automático"
        value="automaticTransmission"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Vidros elétricos"
        value="electricWindows"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Ar condicionado"
        value="airConditioning"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Travas elétricas"
        value="electricLocks"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Câmera de ré"
        value="rearViewCamera"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Air Bag"
        value="airBag"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Roda de liga leve"
        value="alloyWheel"
      />
    </Choice>
  );
}
