import { PageablePayload } from "@/domains/global/types";
import { FetchVehicle } from "@/domains/global/types/model";

export default function selectVehiclesInfoForReport(
  payload: PageablePayload<FetchVehicle>
): Record<string, unknown>[] {
  const itemsFiltered = [];

  for (const vehicle of payload.data) {
    itemsFiltered.push({
      ...vehicle,
    });
  }

  return itemsFiltered;
}
