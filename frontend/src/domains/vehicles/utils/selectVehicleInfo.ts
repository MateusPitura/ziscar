import { Vehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { VehicleFormInputs } from "../types";

export default function selectVehicleInfo(
  payload: Vehicle
): VehicleFormInputs {
  return {
    characteristics: {
      commonCharacteristics: [],
      newCharacteristics: [],
    },
    purchase: {
      paidTo: "",
      purchaseDate: "",
      installment: null,
    },
    vehicle: {
      kilometers: String(payload.kilometers),
      plateNumber: applyMask(payload.plateNumber, "plateNumber") ?? "",
      announcedPrice: applyMask(payload.announcedPrice, "money") ?? "",
      minimumPrice: applyMask(payload.minimumPrice, "money") ?? "",
      commissionValue: applyMask(payload.commissionValue, "money") ?? "",
      color: payload.color,
      fuelType: payload.fuelType,
      status: payload.status,
      chassiNumber: applyMask(payload.chassiNumber, "chassi") ?? "",
      modelYear: payload.modelYear,
      yearOfManufacture: payload.yearOfManufacture,
      modelName: payload.modelName,
      category: payload.category,
      storeId: String(payload.storeId),
      brandId: String(payload.brandId),
    },
  };
}
