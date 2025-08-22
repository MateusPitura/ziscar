import { FetchVehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectVehicleInfo(
  payload: FetchVehicle
): FetchVehicle {
  return {
    ...payload,
    announcedPrice: applyMask(payload.announcedPrice, "money") ?? "",
  };
}
