import { PageablePayload } from "@/domains/global/types";
import { FetchVehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { VEHICLE_INACTIVE_STATUS } from "@shared/types";
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
      status: vehicle.archivedAt
        ? VehicleStatusText[VEHICLE_INACTIVE_STATUS]
        : VehicleStatusText[vehicle.status],
      brand: vehicle.brand.name
    });
  }

  return itemsFiltered;
}
