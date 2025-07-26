import Choice from "@/design-system/Form/Choice";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";

export default function VehicleCommonCharacteristicForm(): ReactNode {
  return (
    <Choice>
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Direção hidráulica"
        value="Direção hidráulica"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Vidros elétricos"
        value="Janelas elétricas"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Ar condicionado"
        value="Ar condicionado"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Travas elétricas"
        value="Travas elétricas"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Câmera de ré"
        value="Câmera de ré"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Air bag"
        value="Air bag"
      />
      <Choice.Checkbox<VehicleSaleFormInputs>
        name="vehicle.commonCharacteristics"
        label="Roda de liga leve"
        value="Rodas de liga leve"
      />
    </Choice>
  );
}
