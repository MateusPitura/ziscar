import { applyMask } from "@/domains/global/utils/applyMask";
import { VehicleSaleDetails, VehicleSaleToString } from "../types";

export default function selectVehicleSaleInfo({
  customer,
  vehicle,
}: VehicleSaleDetails): VehicleSaleToString {
  return {
    vehicle: {
      ...vehicle,
      kilometers: applyMask(vehicle.kilometers, "number") ?? "",
      plateNumber: applyMask(vehicle.plateNumber, "plateNumber") ?? "",
      announcedPrice: applyMask(vehicle.announcedPrice, "money") ?? "",
      minimumPrice: applyMask(vehicle.minimumPrice, "money") ?? "",
      commissionValue: applyMask(vehicle.commissionValue, "money") ?? "",
      chassiNumber: applyMask(vehicle.chassiNumber, "chassi") ?? "",
    },
    customer: {
      ...customer,
      cpf: applyMask(customer.cpf, "cpf") ?? "",
      phone: applyMask(customer.phone, "phone") ?? "",
    },
  };
}
