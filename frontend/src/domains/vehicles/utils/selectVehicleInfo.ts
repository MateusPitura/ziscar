import { VehicleWithPayment } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { defaultCommonCharacteristics } from "../constants";
import { VehicleFormInputs } from "../types";

export default function selectVehicleInfo(
  payload: VehicleWithPayment
): VehicleFormInputs {
  const { payment, vehicle } = payload;

  const commonCharacteristics = [];
  const newCharacteristics = [];

  for (const characteristic of vehicle.characteristics) {
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
    payment: {
      paidTo: payment.paidTo ?? "",
      purchaseDate: payment.purchaseDate,
      upfront: [],
      installment: null,
    },
    vehicle: {
      kilometers: applyMask(vehicle.kilometers, "number") ?? "",
      plateNumber: applyMask(vehicle.plateNumber, "plateNumber") ?? "",
      announcedPrice: applyMask(vehicle.announcedPrice, "money") ?? "",
      minimumPrice: applyMask(vehicle.minimumPrice, "money") ?? "",
      commissionValue: applyMask(vehicle.commissionValue, "money") ?? "",
      chassiNumber: applyMask(vehicle.chassiNumber, "chassi") ?? "",
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      status: vehicle.status,
      modelYear: String(vehicle.modelYear),
      yearOfManufacture: String(vehicle.yearOfManufacture),
      modelName: vehicle.modelName,
      category: vehicle.category,
      storeId: String(vehicle.store.id),
      brandId: String(vehicle.brand.id),
    },
  };
}
