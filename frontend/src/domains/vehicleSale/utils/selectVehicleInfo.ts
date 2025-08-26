import { Vehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function selectVehicleInfo(payload: Vehicle): Vehicle {
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
