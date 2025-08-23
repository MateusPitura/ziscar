import { useMemo, useState, type ReactNode } from "react";
import { DisableVehicle, VehiclesFilterFormInputs } from "../types";
import useDialog from "@/domains/global/hooks/useDialog";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import formatFilters from "@/domains/global/utils/formatFilters";
import { PageablePayload } from "@/domains/global/types";
import { useQuery } from "@tanstack/react-query";
import ExportButton from "@/domains/pdf/components/ExportButton";
import Table from "@/design-system/Table";
import { FetchVehicle } from "@/domains/global/types/model";
import selectVehiclesInfo from "../utils/selectVehiclesInfo";
import selectVehiclesInfoForReport from "../utils/selectVehiclesInfoForReport";
import DisableVehicleModal from "./DisableVehicleModal";
import VehiclesTableActions from "./VehiclesTableActions";
import VehiclesFilterForm from "./VehiclesFilterForm";
import { VehicleStatusText } from "../constants";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
// import { BACKEND_URL } from "@/domains/global/constants";

export default function VehiclesTable(): ReactNode {
  const [disableVehicleInfo, setDisableVehicleInfo] = useState<DisableVehicle>({
    plateNumber: "",
    vehicleId: "",
  });

  const dialog = useDialog();
  //   const { safeFetch } = useSafeFetch();
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
    // return await safeFetch(`${BACKEND_URL}/vehicle?${filter}`, {
    //   resource: "VEHICLES",
    //   action: "READ",
    // });
    console.log("filter: ", filter);
    return {
      total: 3,
      data: [
        {
          id: 1,
          modelName: "Fusca",
          announcedPrice: "2000000",
          plateNumber: "ABC-1234",
          modelYear: "1970",
          status: "DELIVERED",
          archivedAt: undefined,
        },
        {
          id: 2,
          modelName: "Civic",
          announcedPrice: "8000000",
          plateNumber: "XYZ-5678",
          modelYear: "2020",
          status: "IN_STOCK",
          archivedAt: undefined,
        },
        {
          id: 3,
          modelName: "Corolla",
          announcedPrice: "90000000",
          plateNumber: "LMN-9101",
          modelYear: "2021",
          status: "MAINTENANCE",
          archivedAt: undefined,
        },
      ],
    };
  }

  const { data: vehiclesInfo, isFetching: isFetchingVehiclesInfo } = useQuery({
    queryKey: ["vehicles", filterFormatted],
    queryFn: ({ queryKey }) => getVehiclesInfo(queryKey[1]),
    select: selectVehiclesInfo,
  });

  return (
    <>
      <DisableVehicleModal {...disableVehicleInfo} {...dialog} />
      <div className="flex gap-4 justify-end">
        <ExportButton<FetchVehicle, VehiclesFilterFormInputs>
          fileName="Relatório Veículos"
          queryKey={["vehicles", filterFormatted]}
          queryFn={getVehiclesInfo}
          selectQueryFn={selectVehiclesInfoForReport}
          formatFilters={{
            endDate: "Data final",
            startDate: "Data inicial",
          }}
          formatFiltersValues={{}}
          formatColumns={{
            announcedPrice: "Preço anunciado",
            modelName: "Modelo",
            plateNumber: "Placa",
            modelYear: "Ano do modelo",
            status: "Status",
          }}
        />
        <Table.Filter form={<VehiclesFilterForm />} />
      </div>
      <Table>
        <Table.Header gridColumns={10}>
          <Table.Head label="Modelo" />
          <Table.Head label="Placa" />
          <Table.Head label="Ano do modelo" />
          <Table.Head label="Status" />
          <Table.Head label="Preço anunciado" colSpan={1} />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingVehiclesInfo}
          isEmpty={!vehiclesInfo?.total}
          resource="VEHICLES"
          action="READ"
        >
          {vehiclesInfo?.data.map((vehicle) => (
            <Table.Row key={vehicle.id} gridColumns={10}>
              <Table.Cell label={vehicle.modelName} />
              <Table.Cell label={vehicle.plateNumber} />
              <Table.Cell label={vehicle.modelYear} />
              <Table.Cell label={VehicleStatusText[vehicle.status]} />
              <Table.Cell
                label={vehicle.announcedPrice}
                className="text-end"
                colSpan={1}
              />
              <Table.Action>
                <VehiclesTableActions
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
