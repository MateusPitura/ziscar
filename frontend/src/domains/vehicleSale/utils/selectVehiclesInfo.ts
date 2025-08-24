import { FetchVehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectVehiclesInfo(
  payload: FetchVehicle[]
): FetchVehicle[] {
  const itemsFiltered = [];

  for (const vehicle of payload) {
    itemsFiltered.push({
      ...vehicle,
      announcedPrice: applyMask(vehicle?.announcedPrice, "money") ?? "",
      plateNumber: applyMask(vehicle?.plateNumber, "plateNumber") ?? "",
    });
  }

  return itemsFiltered;
}
