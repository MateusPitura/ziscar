import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { VehicleWithPayment } from "@/domains/global/types/model";
import formatVehicleCharacteristics from "@/domains/global/utils/formatVehicleCharacteristics";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { VehicleFormInputs } from "../types";
import selectVehicleInfo from "../utils/selectVehicleInfo";

export default function useGetVehicleInfo(): UseQueryResult<
  VehicleFormInputs & { purchaseValue: string }
> {
  const { vehicleId } = useParams();
  const { safeFetch } = useSafeFetch();

  async function getVehicleInfo(): Promise<VehicleWithPayment> {
    const response = await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}`, {
      resource: "VEHICLES",
      action: "READ",
    });

    const { vehicleCharacteristicValues, ...vehicle } = response;

    return {
      payment: null,
      vehicle: {
        ...vehicle,
        vehicleCharacteristicValues: formatVehicleCharacteristics({
          vehicleCharacteristicValues,
        }),
      },
    };
  }

  return useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: getVehicleInfo,
    select: selectVehicleInfo,
  });
}
