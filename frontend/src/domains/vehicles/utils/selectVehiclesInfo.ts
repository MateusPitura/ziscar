import { PageablePayload } from "@/domains/global/types";
import { FetchVehicle } from "@/domains/global/types/model";

export default function selectVehiclesInfo(
  payload: PageablePayload<FetchVehicle>
): PageablePayload<FetchVehicle> {
  const itemsFiltered = [];

  for (const vehicle of payload.data) {
    itemsFiltered.push({
      ...vehicle,
    });
  }

  return {
    total: payload.total,
    data: itemsFiltered,
  };
}
