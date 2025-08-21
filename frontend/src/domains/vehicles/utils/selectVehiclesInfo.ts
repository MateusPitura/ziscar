import { PageablePayload } from "@/domains/global/types";
import { FetchVehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectVehiclesInfo(
  payload: PageablePayload<FetchVehicle>
): PageablePayload<FetchVehicle> {
  const itemsFiltered = [];

  for (const vehicle of payload.data) {
    itemsFiltered.push({
      ...vehicle,
      announcedPrice: applyMask(vehicle.announcedPrice, "money") ?? "",
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
  };
}
