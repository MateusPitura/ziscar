import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { NewVehicleFormInputs } from "../types";
import ColorPicker from "@/design-system/ColorPicker";
import Select from "@/design-system/Form/Select";
import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
import {
  FuelTypeText,
  VehicleCategoryText,
  VehicleStatusText,
} from "../constants";

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
        required
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.minimumPrice"
        label="Preço mínimo"
        mask="money"
        required
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.commissionValue"
        label="Valor da comissão"
        mask="money"
        required
      />
      <Select<NewVehicleFormInputs>
        name="vehicle.storeId"
        label="Loja"
        options={[
          // 🌠 get stores from database
          {
            value: "1",
            label: "Loja A",
          },
          {
            value: "2",
            label: "Loja B",
          },
          {
            value: "3",
            label: "Loja C",
          },
        ]}
        required
      />
      <Select<NewVehicleFormInputs>
        name="vehicle.status"
        label="Status"
        options={Object.values(VehicleStatus).map((vehicleStatus) => ({
          value: vehicleStatus,
          label: VehicleStatusText[vehicleStatus],
        }))}
        required
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.kilometers"
        label="Quilometragem"
      />
      <Input<NewVehicleFormInputs> name="vehicle.modelName" label="Modelo" />
      <Select<NewVehicleFormInputs>
        name="vehicle.brandId"
        label="Marca"
        options={[
          // 🌠 get brand from database
          {
            value: "1",
            label: "Chevrolet",
          },
          {
            value: "2",
            label: "Volkswagen",
          },
          {
            value: "3",
            label: "Honda",
          },
        ]}
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.modelYear"
        label="Ano do modelo"
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.yearOfManufacture"
        label="Ano de fabricação" // 🌠 talvez um select
      />
      <ColorPicker<NewVehicleFormInputs> label="Cor" name="vehicle.color" />
      <Select<NewVehicleFormInputs>
        name="vehicle.fuelType"
        label="Tipo de combustível"
        options={Object.values(FuelType).map((fuelType) => ({
          value: fuelType,
          label: FuelTypeText[fuelType],
        }))}
      />
      <Select<NewVehicleFormInputs>
        name="vehicle.category"
        label="Categoria"
        options={Object.values(VehicleCategory).map((vehicleCategory) => ({
          value: vehicleCategory,
          label: VehicleCategoryText[vehicleCategory],
        }))}
      />
    </>
  );
}
