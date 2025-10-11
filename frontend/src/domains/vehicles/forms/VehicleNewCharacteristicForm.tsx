import FieldArray from "@/design-system/Form/FieldArray";
import Input from "@/design-system/Form/Input";
import { type ReactElement } from "react";
import { VehicleFormInputs } from "../types";

export default function VehicleNewCharacteristicForm(): ReactElement {
  return (
    <FieldArray<VehicleFormInputs>
      name="characteristics.newCharacteristics"
      appendText="Adicionar característica"
      removeText="Remover característica"
      title="Adicione características"
      appendDefaultValues={{ description: "" }}
      maxLength={10}
      render={(index) => (
        <div className="col-span-full">
          <Input<VehicleFormInputs>
            name={`characteristics.newCharacteristics.${index}.description`}
            label="Característica"
            placeholder="Câmbio automático"
            required
          />
        </div>
      )}
    />
  );
}
