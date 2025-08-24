import Search from "@/design-system/Form/Search";
import { FetchVehicle } from "@/domains/global/types/model";
import { VehicleStatus } from "@shared/enums";
import type { ReactNode } from "react";
import useVehicleSalePageContext from "../hooks/useVehicleSalePageContext";
import { VehicleSaleFormInputs } from "../types";
import selectVehiclesInfo from "../utils/selectVehiclesInfo";
import { plateSearchSchema } from "../schemas";
// import { BACKEND_URL } from "@/domains/global/constants";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";

export default function VehicleSearchForm(): ReactNode {
  //   const { safeFetch } = useSafeFetch();
  const { handleVehicle } = useVehicleSalePageContext();

  async function getVehiclesInfo(filter?: string): Promise<FetchVehicle[]> {
    if (!filter) return [];

    // const result = await safeFetch(
    //   `${BACKEND_URL}/vehicles?plateNumber=${filter}&orderBy=fullName`,
    //   {
    //     resource: "VEHICLES",
    //     action: "READ",
    //   }
    // );

    // return result.data;

    return [
      {
        id: 1,
        modelName: "Fusca",
        announcedPrice: "800000000",
        plateNumber: "ABC1234",
        modelYear: "1970",
        status: VehicleStatus.DELIVERED,
        archivedAt: undefined,
      },
      {
        id: 2,
        modelName: "Civic",
        announcedPrice: "8000000",
        plateNumber: "XYZ5678",
        modelYear: "2020",
        status: VehicleStatus.IN_STOCK,
        archivedAt: undefined,
      },
      {
        id: 3,
        modelName: "Corolla",
        announcedPrice: "90000000",
        plateNumber: "BRA2E19",
        modelYear: "2021",
        status: VehicleStatus.MAINTENANCE,
        archivedAt: undefined,
      },
    ];
  }

  return (
    <Search<VehicleSaleFormInputs, FetchVehicle[]>
      label="Placa"
      name="vehicle.id"
      fetchCallback={getVehiclesInfo}
      queryKey="vehicles"
      onChange={(value) => {
        if (!value) {
          handleVehicle(null);
          return;
        }
        handleVehicle(value);
      }}
      labelKey="modelName"
      valueKey="id"
      descriptionKey="plateNumber"
      required
      select={selectVehiclesInfo}
      formatSearch={(search) => {
        const result = plateSearchSchema.safeParse(search);
        if (result.success) {
          return result.data;
        }
        return undefined;
      }}
    />
  );
}
