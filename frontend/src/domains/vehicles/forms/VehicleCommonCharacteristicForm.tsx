import Choice from "@/design-system/Form/Choice";
import type { ReactNode } from "react";
import { VehicleFormInputs } from "../types";

export default function VehicleCommonCharacteristicForm(): ReactNode {
  return (
    <Choice>
      <Choice.Checkbox<VehicleFormInputs>
        name="characteristics.commonCharacteristics"
        label="Air bag"
        value="Air bag"
      />
      <Choice.Checkbox<VehicleFormInputs>
        name="characteristics.commonCharacteristics"
        label="Ar condicionado"
        value="Ar condicionado"
      />
      <Choice.Checkbox<VehicleFormInputs>
        name="characteristics.commonCharacteristics"
        label="Câmera de ré"
        value="Câmera de ré"
      />
      <Choice.Checkbox<VehicleFormInputs>
        name="characteristics.commonCharacteristics"
        label="Direção hidráulica"
        value="Direção hidráulica"
      />
      <Choice.Checkbox<VehicleFormInputs>
        name="characteristics.commonCharacteristics"
        label="Roda de liga leve"
        value="Rodas de liga leve"
      />
      <Choice.Checkbox<VehicleFormInputs>
        name="characteristics.commonCharacteristics"
        label="Travas elétricas"
        value="Travas elétricas"
      />
      <Choice.Checkbox<VehicleFormInputs>
        name="characteristics.commonCharacteristics"
        label="Vidros elétricos"
        value="Janelas elétricas"
      />
    </Choice>
  );
}
