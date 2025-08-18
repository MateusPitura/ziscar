import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { NewVehicleFormInputs } from "../types";
import ColorPicker from "@/design-system/ColorPicker";

export default function NewVehicleForm(): ReactNode {
  return (
    <>
      <Input<NewVehicleFormInputs>
        name="vehicle.plateNumber"
        label="Número da placa"
        required
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.chassiNumber"
        label="Número do chassi"
        required
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.announcedPrice"
        label="Preço anunciado"
        mask="money"
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.minimumPrice"
        label="Preço mínimo"
        mask="money"
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.commissionValue"
        label="Valor da comissão"
        mask="money"
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.kilometers"
        label="Quilometragem"
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.modelName"
        label="Modelo do veículo"
      />
      <ColorPicker<NewVehicleFormInputs> label="Cor" name="vehicle.color" />
      <Input<NewVehicleFormInputs>
        name="vehicle.modelYear"
        label="Ano do modelo"
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.yearOfManufacture"
        label="Ano de fabricação" // 🌠 talvez um select
      />
    </>
  );
}
