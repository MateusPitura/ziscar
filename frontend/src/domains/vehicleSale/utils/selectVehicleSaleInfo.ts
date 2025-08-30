import { Vehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { VehicleToString } from "../types";

export default function selectVehicleSaleInfo(payload: Vehicle): VehicleToString {
  return {
    ...payload,
    kilometers: applyMask(payload.kilometers, "number") ?? "",
    plateNumber: applyMask(payload.plateNumber, "plateNumber") ?? "",
    announcedPrice: applyMask(payload.announcedPrice, "money") ?? "",
    minimumPrice: applyMask(payload.minimumPrice, "money") ?? "",
    commissionValue: applyMask(payload.commissionValue, "money") ?? "",
    chassiNumber: applyMask(payload.chassiNumber, "chassi") ?? "",
  };
}
