import Table from "@/design-system/Table";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import useDialog from "@/domains/global/hooks/useDialog";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { PageablePayload } from "@/domains/global/types";
import {
  FetchBrand,
  FetchStore,
  FetchVehicle,
} from "@/domains/global/types/model";
import formatFilters from "@/domains/global/utils/formatFilters";
import ExportButton from "@/domains/pdf/components/ExportButton";
import selectStoresInfo from "@/domains/stores/utils/selectStoresInfo";
import { ITEMS_PER_PAGE } from "@shared/constants";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import {
  VehicleCategoryText,
  VEHICLES_TABLE,
  VehicleStatusText,
} from "../constants";
import { DisableVehicle, VehiclesFilterFormInputs } from "../types";
import selectBrandsInfo from "../utils/selectBrandsInfo";
import selectVehiclesInfo from "../utils/selectVehiclesInfo";
import selectVehiclesInfoForReport from "../utils/selectVehiclesInfoForReport";
import DisableVehicleModal from "./DisableVehicleModal";
import VehiclesFilterForm from "./VehiclesFilterForm";
import VehiclesTableActions from "./VehiclesTableActions";
import VehicleStatusTag from "./VehicleStatusTag";

const gridColumns = 7;

export default function VehiclesTable(): ReactNode {
  const [disableVehicleInfo, setDisableVehicleInfo] = useState<DisableVehicle>({
    plateNumber: "",
    vehicleId: "",
  });

  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const { vehiclesFilter, handleVehiclesFilter } = useFilterContext();

  function handleDisableVehicleInfo(vehicle: DisableVehicle) {
    dialog.openDialog();
    setDisableVehicleInfo(vehicle);
  }

  function handleChangePage(page: number) {
    handleVehiclesFilter({ page });
  }

  const filterFormatted = useMemo(() => {
    if (vehiclesFilter) {
      return formatFilters(vehiclesFilter);
    }
    return "";
  }, [vehiclesFilter]);

  async function getVehiclesInfo(
    filter?: string
  ): Promise<PageablePayload<FetchVehicle>> {
    return await safeFetch(
      `${BACKEND_URL}/vehicles?${filter}&limit=${ITEMS_PER_PAGE}`,
      {
        resource: "VEHICLES",
        action: "READ",
      }
    );
  }

  async function getBrandsInfo(): Promise<FetchBrand[]> {
    return await safeFetch(`${BACKEND_URL}/vehicles/brands`);
  }

  async function getStoresInfo(): Promise<PageablePayload<FetchStore>> {
    return await safeFetch(`${BACKEND_URL}/store?orderBy=name`, {
      resource: "STORES",
      action: "READ",
    });
  }

  const { data: vehiclesInfo, isLoading: isFetchingVehiclesInfo } = useQuery({
    queryKey: ["vehicles", filterFormatted],
    queryFn: ({ queryKey }) => getVehiclesInfo(queryKey[1]),
    select: selectVehiclesInfo,
  });

  const { data: brandsInfo } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrandsInfo,
    select: selectBrandsInfo,
  });

  const { data: storesInfo } = useQuery({
    queryKey: ["stores"],
    queryFn: getStoresInfo,
    select: selectStoresInfo,
  });

  const brandNamesMap = useMemo(() => {
    if (!brandsInfo) return {};
    return brandsInfo.reduce((acc, brand) => {
      acc[brand.value] = brand.label;
      return acc;
    }, {} as Record<string, string>);
  }, [brandsInfo]);

  const storeNamesMap = useMemo(() => {
    if (!storesInfo?.data) return {};
    return storesInfo.data.reduce((acc, store) => {
      acc[String(store.id)] = store.name;
      return acc;
    }, {} as Record<string, string>);
  }, [storesInfo]);

  const biggestValueLength = useMemo(() => {
    if (!vehiclesInfo?.data.length) return 0;
    return Math.max(...vehiclesInfo.data.map((v) => v.announcedPrice.length));
  }, [vehiclesInfo?.data]);

  return (
    <>
      <DisableVehicleModal {...disableVehicleInfo} {...dialog} />
      <div className="flex gap-4 justify-between">
        <ExportButton<FetchVehicle, VehiclesFilterFormInputs>
          fileName="Relatório Veículos"
          queryKey={["vehicles", filterFormatted]}
          queryFn={getVehiclesInfo}
          selectQueryFn={selectVehiclesInfoForReport}
          formatFilters={{
            endDate: "Data final",
            startDate: "Data inicial",
            storeId: "Loja",
            brandId: "Marca",
            status: "Status",
            category: "Categoria",
            modelYear: "Ano do modelo",
            yearOfManufacture: "Ano de fabricação",
            modelName: "Modelo",
            plateNumber: "Placa",
            announcedPriceMin: "Preço mínimo",
            announcedPriceMax: "Preço máximo",
          }}
          formatFiltersValues={{
            status: VehicleStatusText,
            category: { ...VehicleCategoryText, "": "Todas" },
            brandId: brandNamesMap,
            storeId: storeNamesMap,
          }}
          formatColumns={{
            modelName: "Modelo",
            brand: 'Marca',
            plateNumber: "Placa",
            modelYear: "Ano do modelo",
            status: "Status",
            announcedPrice: "Preço anunciado",
          }}
        />
        <Table.Filter form={<VehiclesFilterForm />} />
      </div>
      <Table>
        <Table.Header gridColumns={gridColumns}>
          <Table.Head
            label={VEHICLES_TABLE.model.label}
            colSpan={VEHICLES_TABLE.model.colSpan}
          />
          <Table.Head
            label={VEHICLES_TABLE.brand.label}
            colSpan={VEHICLES_TABLE.brand.colSpan}
          />
          <Table.Head
            label={VEHICLES_TABLE.plate.label}
            colSpan={VEHICLES_TABLE.plate.colSpan}
          />
          <Table.Head
            label={VEHICLES_TABLE.year.label}
            colSpan={VEHICLES_TABLE.year.colSpan}
          />
          <Table.Head
            label={VEHICLES_TABLE.price.label}
            colSpan={VEHICLES_TABLE.price.colSpan}
          />
          <Table.Head
            label={VEHICLES_TABLE.status.label}
            colSpan={VEHICLES_TABLE.status.colSpan}
          />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingVehiclesInfo}
          isEmpty={!vehiclesInfo?.total}
          resource="VEHICLES"
          action="READ"
        >
          {vehiclesInfo?.data.map((vehicle) => (
            <Table.Row key={vehicle.id} gridColumns={gridColumns}>
              <Table.Cell
                label={vehicle.modelName}
                columnLabel={VEHICLES_TABLE.model.label}
                colSpan={VEHICLES_TABLE.model.colSpan}
              />
              <Table.Cell
                label={vehicle.brandName}
                columnLabel={VEHICLES_TABLE.brand.label}
                colSpan={VEHICLES_TABLE.brand.colSpan}
              />
              <Table.Cell
                label={vehicle.plateNumber}
                colSpan={VEHICLES_TABLE.plate.colSpan}
                columnLabel={VEHICLES_TABLE.plate.label}
              />
              <Table.Cell
                label={vehicle.modelYear}
                colSpan={VEHICLES_TABLE.year.colSpan}
                columnLabel={VEHICLES_TABLE.year.label}
              />
              <Table.Cell
                label={vehicle.announcedPrice.padStart(
                  biggestValueLength,
                  BLANK
                )}
                columnLabel={VEHICLES_TABLE.price.label}
                className="font-mono xl:whitespace-pre"
                colSpan={VEHICLES_TABLE.price.colSpan}
              />
              <Table.Cell
                columnLabel={VEHICLES_TABLE.status.label}
                label={
                  <VehicleStatusTag
                    isActive={!vehicle.archivedAt}
                    status={vehicle.status}
                  />
                }
                colSpan={VEHICLES_TABLE.status.colSpan}
              />
              <Table.Action>
                <VehiclesTableActions
                  status={vehicle.status}
                  isActive={!vehicle.archivedAt}
                  vehicleId={String(vehicle.id)}
                  plateNumber={vehicle.plateNumber}
                  handleDisableVehicleInfo={handleDisableVehicleInfo}
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer
          currentStartItem={vehiclesFilter?.page}
          totalItems={vehiclesInfo?.total}
          onClickNavigateBtn={handleChangePage}
          isLoading={isFetchingVehiclesInfo}
        />
      </Table>
    </>
  );
}
