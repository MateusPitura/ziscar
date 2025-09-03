import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import SideSheet from "@/design-system/SideSheet";
import { memo, ReactElement, ReactNode } from "react";
import { vehicleFilterDefaultValues } from "../constants";
import { useFormContext } from "react-hook-form";
import { SchemaVehiclesFilterForm } from "../schemas";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { VehiclesFilterFormInputs } from "../types";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { PageablePayload } from "@/domains/global/types";
import { FetchBrand, FetchStore } from "@/domains/global/types/model";
import selectStoresInfo from "@/domains/stores/utils/selectStoresInfo";
import selectBrandsInfo from "../utils/selectBrandsInfo";
import {
  MODEL_YEARS_OPTIONS,
  VehicleCategoryText,
  VehicleStatusText,
  YEARS_OF_MANUFACTURE_OPTIONS,
  ActivityStatusText,
} from "../constants";
import { VehicleCategory, VehicleStatus } from "@shared/enums";
import { ActivityStatus } from "@shared/types";

function VehiclesFilterForm(): ReactNode {
  const { vehiclesFilter, handleVehiclesFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();
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

  function handleSubmit(data: VehiclesFilterFormInputs) {
    handleVehiclesFilter({ page: 1, ...data });
    closeDialog();
  }

  return (
    <Form<VehiclesFilterFormInputs>
      schema={SchemaVehiclesFilterForm}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col"
      defaultValues={{
        startDate: vehiclesFilter?.startDate || "",
        endDate: vehiclesFilter?.endDate || "",
        storeId: vehiclesFilter?.storeId || "",
        brandId: vehiclesFilter?.brandId || "",
        status: vehiclesFilter?.status || "",
        category: vehiclesFilter?.category || "",
        modelYear: vehiclesFilter?.modelYear || "",
        yearOfManufacture: vehiclesFilter?.yearOfManufacture || "",
        modelName: vehiclesFilter?.modelName || "",
        plateNumber: vehiclesFilter?.plateNumber || "",
        announcedPriceMin: vehiclesFilter?.announcedPriceMin || "",
        announcedPriceMax: vehiclesFilter?.announcedPriceMax || "",
        activityStatus: vehiclesFilter?.activityStatus || ActivityStatus.ACTIVE,
      }}
      replaceEmptyStringToNull={false}
    >
      <VehiclesFilterFormContent
        storesInfo={storesInfo}
        isFetchingStoresInfo={isFetchingStoresInfo}
        brandsInfo={brandsInfo}
        isFetchingBrandsInfo={isFetchingBrandsInfo}
      />
    </Form>
  );
}

interface VehiclesFilterFormContentProps {
  storesInfo?: PageablePayload<FetchStore>;
  isFetchingStoresInfo: boolean;
  brandsInfo?: { value: string; label: string }[];
  isFetchingBrandsInfo: boolean;
}

function VehiclesFilterFormContent({
  storesInfo,
  isFetchingStoresInfo,
  brandsInfo,
  isFetchingBrandsInfo,
}: VehiclesFilterFormContentProps): ReactElement {
  const { reset } = useFormContext();
  const { handleVehiclesFilter } = useFilterContext();
  const { closeDialog } = useDialogContext();

  function handleReset() {
    handleVehiclesFilter(vehicleFilterDefaultValues);
    reset(vehicleFilterDefaultValues);
    closeDialog();
  }

  return (
    <>
      <SideSheet.Body className="flex flex-col gap-4 max-h-[82vh] overflow-y-auto">
        <Input<VehiclesFilterFormInputs>
          name="modelName"
          label="Modelo"
          placeholder="Nome do modelo"
        />
        <Input<VehiclesFilterFormInputs>
          name="plateNumber"
          label="Placa"
          placeholder="ABC1234"
          mask="plateNumber"
          maxLength={8}
        />
        <Select<VehiclesFilterFormInputs>
          name="storeId"
          label="Loja"
          options={[
            { value: "", label: "Todas as lojas" },
            ...(storesInfo?.data.map((store) => ({
              value: String(store.id),
              label: String(store.name),
            })) ?? []),
          ]}
          loading={isFetchingStoresInfo}
        />
        <Select<VehiclesFilterFormInputs>
          name="status"
          label="Status"
          options={[
            { value: "", label: "Todos os status" },
            ...Object.values(VehicleStatus).map((vehicleStatus) => ({
              value: vehicleStatus,
              label: VehicleStatusText[vehicleStatus],
            })),
          ]}
        />
        <Select<VehiclesFilterFormInputs>
          name="brandId"
          label="Marca"
          options={[
            { value: "", label: "Todas as marcas" },
            ...(brandsInfo ?? []),
          ]}
          loading={isFetchingBrandsInfo}
        />
        <Select<VehiclesFilterFormInputs>
          name="category"
          label="Categoria"
          options={[
            { value: "", label: "Todas as categorias" },
            ...Object.values(VehicleCategory).map((category) => ({
              value: category,
              label: VehicleCategoryText[category],
            })),
          ]}
        />
        <Select<VehiclesFilterFormInputs>
          name="activityStatus"
          label="Status de atividade"
          options={Object.values(ActivityStatus).map((activityStatus) => ({
            value: activityStatus,
            label: ActivityStatusText[activityStatus],
          }))}
        />
        <Select<VehiclesFilterFormInputs>
          name="modelYear"
          label="Ano do modelo"
          options={[
            { value: "", label: "Todos os anos" },
            ...MODEL_YEARS_OPTIONS,
          ]}
        />
        <Select<VehiclesFilterFormInputs>
          name="yearOfManufacture"
          label="Ano de fabricação"
          options={[
            { value: "", label: "Todos os anos" },
            ...YEARS_OF_MANUFACTURE_OPTIONS,
          ]}
        />
        <Input<VehiclesFilterFormInputs>
          name="announcedPriceMin"
          label="Preço anunciado mínimo"
          mask="money"
          placeholder="R$ 0,00"
        />
        <Input<VehiclesFilterFormInputs>
          name="announcedPriceMax"
          label="Preço anunciado máximo"
          mask="money"
          placeholder="R$ 0,00"
        />
        <Input<VehiclesFilterFormInputs>
          name="startDate"
          label="Data inicial de criação"
          type="date"
        />
        <Input<VehiclesFilterFormInputs>
          name="endDate"
          label="Data final de criação"
          type="date"
        />
      </SideSheet.Body>
      <SideSheet.Footer
        primaryLabel="Aplicar"
        secondaryLabel="Limpar"
        onSecondaryCallback={handleReset}
        dirty
      />
    </>
  );
}

export default memo(VehiclesFilterForm);
