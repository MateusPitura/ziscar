import Choice from "@/design-system/Form/Choice";
import type { ReactNode } from "react";
import { defaultCommonCharacteristics } from "../constants";
import { VehicleFormInputs } from "../types";

export default function VehicleCommonCharacteristicForm(): ReactNode {
  return (
    <Choice>
      {defaultCommonCharacteristics.map((c) => (
        <Choice.Checkbox<VehicleFormInputs>
          name="characteristics.commonCharacteristics"
          label={c}
          value={c}
        />
      ))}
    </Choice>
  );
}
