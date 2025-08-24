import ColorPicker from "@/design-system/ColorPicker";
import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
import type { ReactNode } from "react";
import {
  FuelTypeText,
  MODEL_YEARS_OPTIONS,
  VehicleCategoryText,
  VehicleStatusText,
  YEARS_OF_MANUFACTURE_OPTIONS,
} from "../constants";
import { NewVehicleFormInputs } from "../types";
import { useFormContext } from "react-hook-form";
import { PageablePayload } from "@/domains/global/types";
import { FetchBrand, FetchStore } from "@/domains/global/types/model";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { BACKEND_URL } from "@/domains/global/constants";
import { useQuery } from "@tanstack/react-query";
import selectStoresInfo from "@/domains/stores/utils/selectStoresInfo";
import selectBrandsInfo from "../utils/selectBrandsInfo";

export default function NewVehicleForm(): ReactNode {
  const { setValue } = useFormContext<NewVehicleFormInputs>();
  const { safeFetch } = useSafeFetch();

  async function getStoresInfo(): Promise<PageablePayload<FetchStore>> {
    return await safeFetch(`${BACKEND_URL}/store?orderBy=name`, {
      resource: "STORES",
      action: "READ",
    });
  }

  const { data: storesInfo, isFetching: isFetchingStoresInfo } = useQuery({
    queryKey: ["stores"],
    queryFn: getStoresInfo,
    select: selectStoresInfo,
  });

  async function getBrandsInfo(): Promise<FetchBrand[]> {
    return await safeFetch(`${BACKEND_URL}/vehicles/brands`);
  }

  const { data: brandsInfo, isFetching: isFetchingBrandsInfo } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrandsInfo,
    select: selectBrandsInfo,
  });

  return (
    <>
      <Input<NewVehicleFormInputs>
        name="vehicle.plateNumber"
        label="Número da placa"
        required
        mask="plateNumber"
        maxLength={8}
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.chassiNumber"
        label="Número do chassi"
        required
        mask="chassi"
        maxLength={17}
      />
      <Select<NewVehicleFormInputs>
        name="vehicle.storeId"
        label="Loja"
        options={
          storesInfo?.data.map((store) => ({
            value: String(store.id),
            label: String(store.name),
          })) ?? []
        }
        required
        loading={isFetchingStoresInfo}
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.minimumPrice"
        label="Preço mínimo"
        mask="money"
        required
      />
      <Input<NewVehicleFormInputs>
        name="vehicle.announcedPrice"
        label="Preço anunciado"
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
        mask="number"
      />
      <Select<NewVehicleFormInputs>
        name="vehicle.category"
        label="Categoria"
        options={Object.values(VehicleCategory).map((vehicleCategory) => ({
          value: vehicleCategory,
          label: VehicleCategoryText[vehicleCategory],
        }))}
      />
      <Input<NewVehicleFormInputs> name="vehicle.modelName" label="Modelo" />
      <Select<NewVehicleFormInputs>
        name="vehicle.brandId"
        label="Marca"
        options={brandsInfo ?? []}
        loading={isFetchingBrandsInfo}
      />
      <ColorPicker<NewVehicleFormInputs> label="Cor" name="vehicle.color" />
      <Select<NewVehicleFormInputs>
        name="vehicle.yearOfManufacture"
        label="Ano de fabricação"
        options={YEARS_OF_MANUFACTURE_OPTIONS}
        onChange={(option) => {
          if (!option) {
            setValue("vehicle.modelYear", "");
            return;
          }

          setValue("vehicle.modelYear", String(Number(option) + 1));
        }}
      />
      <Select<NewVehicleFormInputs>
        name="vehicle.modelYear"
        label="Ano do modelo"
        options={MODEL_YEARS_OPTIONS}
      />
      <Select<NewVehicleFormInputs>
        name="vehicle.fuelType"
        label="Tipo de combustível"
        options={Object.values(FuelType).map((fuelType) => ({
          value: fuelType,
          label: FuelTypeText[fuelType],
        }))}
      />
    </>
  );
}
