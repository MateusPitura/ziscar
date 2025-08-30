import { VehicleWithPayment } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { VehicleToString } from "../types";

export default function selectVehicleInfo(payload: VehicleWithPayment): VehicleToString {
  const { vehicle } = payload;

  return {
    ...vehicle,
    kilometers: applyMask(vehicle.kilometers, "number") ?? "",
    plateNumber: applyMask(vehicle.plateNumber, "plateNumber") ?? "",
    announcedPrice: applyMask(vehicle.announcedPrice, "money") ?? "",
    minimumPrice: applyMask(vehicle.minimumPrice, "money") ?? "",
    commissionValue: applyMask(vehicle.commissionValue, "money") ?? "",
    chassiNumber: applyMask(vehicle.chassiNumber, "chassi") ?? "",
  };
}
