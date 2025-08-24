import { type ReactElement } from "react";
import FieldArray from "@/design-system/Form/FieldArray";
import Input from "@/design-system/Form/Input";
import { NewVehicleFormInputs } from "../types";

export default function VehicleNewCharacteristicForm(): ReactElement {
  return (
    <FieldArray<NewVehicleFormInputs>
      name="characteristics.newCharacteristics"
      appendText="Adicionar característica"
      removeText="Remover característica"
      appendDefaultValues={{ description: "" }}
      maxLength={10}
      render={(index) => (
        <div className="col-span-full">
          <Input<NewVehicleFormInputs>
            name={`characteristics.newCharacteristics.${index}.description`}
            label="Característica"
            placeholder="Câmbio automático"
          />
        </div>
      )}
    />
  );
}
