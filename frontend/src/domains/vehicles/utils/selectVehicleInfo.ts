import { Vehicle } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { VehicleFormInputs } from "../types";
import { defaultCommonCharacteristics } from "../constants";

export default function selectVehicleInfo(payload: Vehicle): VehicleFormInputs {
  const commonCharacteristics = [];
  const newCharacteristics = [];

  for (const characteristic of payload.characteristics) {
    if (defaultCommonCharacteristics.includes(characteristic)) {
      commonCharacteristics.push(characteristic);
    } else {
      newCharacteristics.push({ description: characteristic });
    }
  }

  return {
    characteristics: {
      commonCharacteristics,
      newCharacteristics,
    },
    purchase: {
      paidTo: "",
      purchaseDate: "",
      installment: null,
    },
    vehicle: {
      kilometers: applyMask(payload.kilometers, "number") ?? "",
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
      storeId: String(payload.store.id),
      brandId: String(payload.brand.id),
    },
  };
}
