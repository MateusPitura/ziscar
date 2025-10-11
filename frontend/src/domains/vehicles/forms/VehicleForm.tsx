import ColorPicker from "@/design-system/ColorPicker";
import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { PageablePayload } from "@/domains/global/types";
import { FetchBrand, FetchStore } from "@/domains/global/types/model";
import selectStoresInfo from "@/domains/stores/utils/selectStoresInfo";
import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  FuelTypeText,
  VehicleCategoryText,
  VehicleStatusText,
  YEARS_OF_MANUFACTURE_OPTIONS,
} from "../constants";
import { VehicleFormInputs } from "../types";
import selectBrandsInfo from "../utils/selectBrandsInfo";

const VehicleStatusSanitized = Object.values(VehicleStatus).filter(
  (status) => ![VehicleStatus.SOLD].includes(status)
);

export default function VehicleForm(): ReactNode {
  const { setValue, control } = useFormContext<VehicleFormInputs>();
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

  const yearOfManufactureWatch = useWatch({
    control,
    name: "vehicle.yearOfManufacture",
  });

  return (
    <>
      <Input<VehicleFormInputs>
        name="vehicle.plateNumber"
        label="Placa"
        required
        mask="plateNumber"
        maxLength={8}
      />
      <Input<VehicleFormInputs>
        name="vehicle.chassiNumber"
        label="Chassi"
        required
        mask="chassi"
        maxLength={17}
      />
      <Select<VehicleFormInputs>
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
      <Input<VehicleFormInputs>
        name="vehicle.minimumPrice"
        label="Preço mínimo"
        mask="money"
        required
      />
      <Input<VehicleFormInputs>
        name="vehicle.announcedPrice"
        label="Preço anunciado"
        mask="money"
        required
      />
      <Input<VehicleFormInputs>
        name="vehicle.commissionValue"
        label="Comissão máxima"
        mask="money"
        required
      />
      <Select<VehicleFormInputs>
        name="vehicle.status"
        label="Status"
        options={Object.values(VehicleStatusSanitized).map((vehicleStatus) => ({
          value: vehicleStatus,
          label: VehicleStatusText[vehicleStatus],
        }))}
        required
      />
      <Select<VehicleFormInputs>
        name="vehicle.brandId"
        label="Marca"
        options={brandsInfo ?? []}
        loading={isFetchingBrandsInfo}
        required
      />
      <Input<VehicleFormInputs> name="vehicle.modelName" label="Modelo" />
      <Input<VehicleFormInputs>
        name="vehicle.kilometers"
        label="Quilometragem"
        mask="number"
      />
      <Select<VehicleFormInputs>
        name="vehicle.category"
        label="Categoria"
        options={Object.values(VehicleCategory).map((vehicleCategory) => ({
          value: vehicleCategory,
          label: VehicleCategoryText[vehicleCategory],
        }))}
      />
      <ColorPicker<VehicleFormInputs> label="Cor" name="vehicle.color" />
      <Select<VehicleFormInputs>
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
      <Select<VehicleFormInputs>
        name="vehicle.modelYear"
        label="Ano do modelo"
        disabled={!yearOfManufactureWatch}
        options={[
          {
            label: yearOfManufactureWatch,
            value: yearOfManufactureWatch,
          },
          {
            label: String(Number(yearOfManufactureWatch) + 1),
            value: String(Number(yearOfManufactureWatch) + 1),
          },
        ]}
      />
      <Select<VehicleFormInputs>
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
