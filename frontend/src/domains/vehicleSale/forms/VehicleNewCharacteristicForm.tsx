import { type ReactElement } from "react";
import FieldArray from "@/design-system/Form/FieldArray";
import { VehicleSaleFormInputs } from "../types";
import Input from "@/design-system/Form/Input";

export default function VehicleNewCharacteristicForm(): ReactElement {
  return (
    <FieldArray<VehicleSaleFormInputs>
      name="vehicle.newCharacteristics"
      appendText="Adicionar característica"
      removeText="Remover característica"
      appendDefaultValues={{ label: "", value: "" }}
      maxLength={10}
      render={(index) => (
        <>
          <Input<VehicleSaleFormInputs>
            name={`vehicle.newCharacteristics.${index}.label`}
            label="Característica"
            placeholder="Câmbio"
          />
          <Input<VehicleSaleFormInputs>
            name={`vehicle.newCharacteristics.${index}.value`}
            label="Valor"
            placeholder="Automático"
          />
        </>
      )}
    />
  );
}
