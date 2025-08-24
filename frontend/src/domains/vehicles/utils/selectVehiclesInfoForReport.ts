import { PageablePayload } from "@/domains/global/types";
import { FetchVehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { VehicleStatusText } from "../constants";

export default function selectVehiclesInfoForReport(
  payload: PageablePayload<FetchVehicle>
): Record<string, unknown>[] {
  const itemsFiltered = [];

  for (const vehicle of payload.data) {
    itemsFiltered.push({
      ...vehicle,
      announcedPrice: applyMask(vehicle.announcedPrice, "money") ?? "",
      plateNumber: applyMask(vehicle.plateNumber, "plateNumber") ?? "",
      status: VehicleStatusText[vehicle.status],
    });
  }

  return itemsFiltered;
}
