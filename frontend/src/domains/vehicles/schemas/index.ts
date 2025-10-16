import {
  addIssue,
  installmentFieldsRule,
  SchemaPayableInstallment,
  SchemaPayableUpfront,
  upfrontFieldsRule,
} from "@/domains/global/schemas";
import { applyMask } from "@/domains/global/utils/applyMask";
import {
  EXPENSECATEGORY_VALUES,
  FUELTYPE_VALUES,
  VEHICLECATEGORY_VALUES,
  VEHICLESTATUS_VALUES,
} from "@shared/enums";
import { s } from "@shared/safeZod";
import { VehicleStatusForFilter } from "@shared/types";
import {
  defaultCommonCharacteristics,
  MODEL_YEARS,
  YEARS_OF_MANUFACTURE,
} from "../constants";
import { VehicleFormInputs } from "../types";

export const SchemaVehiclesFilterForm = s
  .object({
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
    storeId: s.string().or(s.empty()),
    brandId: s.string().or(s.empty()),
    status: s.enumeration(VehicleStatusForFilter).or(s.empty()),
    category: s.enumeration(VEHICLECATEGORY_VALUES).or(s.empty()),
    modelYear: s.enumeration(MODEL_YEARS).or(s.empty()),
    yearOfManufacture: s.enumeration(YEARS_OF_MANUFACTURE).or(s.empty()),
    modelName: s.string().or(s.empty()),
    plateNumber: s
      .string(8)
      .transform((plateNumber) => plateNumber.replace(/[^A-Z0-9]/gi, ""))
      .or(s.empty()),
    announcedPriceMin: s
      .numberString({
        formatter: (value) => applyMask(value, "money") ?? "",
      })
      .or(s.empty()),
    announcedPriceMax: s
      .numberString({
        formatter: (value) => applyMask(value, "money") ?? "",
      })
      .or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaVehicleForm = s
  .object({
    payment: s.object({
      purchaseDate: s.paymentDate(),
      paidTo: s.string().or(s.empty()),
      upfront: SchemaPayableUpfront,
      installment: SchemaPayableInstallment.nullable(),
    }),
    vehicle: s.object({
      plateNumber: s.plateNumber(),
      chassiNumber: s.chassi(),
      announcedPrice: s.numberString({
        formatter: (value) => applyMask(value, "money") ?? "",
      }),
      minimumPrice: s.numberString({
        formatter: (value) => applyMask(value, "money") ?? "",
      }),
      commissionValue: s.numberString({
        min: 0,
        formatter: (value) => applyMask(value, "money") ?? "",
      }),
      storeId: s.string(),
      kilometers: s.numberString({
        min: 0,
        max: 1_000_000,
        formatter: (value) => applyMask(value, "number") ?? "",
      }),
      modelName: s.string().or(s.empty()),
      brandId: s.string(),
      color: s.string().or(s.empty()),
      modelYear: s.enumeration(MODEL_YEARS).or(s.empty()),
      yearOfManufacture: s.enumeration(YEARS_OF_MANUFACTURE).or(s.empty()),
      fuelType: s.enumeration(FUELTYPE_VALUES).or(s.empty()),
      status: s.enumeration(VEHICLESTATUS_VALUES),
      category: s.enumeration(VEHICLECATEGORY_VALUES).or(s.empty()),
    }),
    characteristics: s.object({
      commonCharacteristics: s.checkbox(defaultCommonCharacteristics),
      newCharacteristics: s.array(
        s.object({
          description: s.string(),
        }),
        10
      ),
    }),
  })
  .superRefine(installmentFieldsRule)
  .superRefine(upfrontFieldsRule)
  .superRefine((data, ctx) => {
    const { modelYear, yearOfManufacture } = data.vehicle;

    if (modelYear !== "" && yearOfManufacture !== "") {
      if (
        Number(modelYear) < Number(yearOfManufacture) ||
        Number(modelYear) > Number(yearOfManufacture) + 1
      ) {
        addIssue<VehicleFormInputs>(
          ctx,
          "vehicle.modelYear",
          "O ano do modelo deve ser igual ou 1 ano a mais ao ano de fabricação"
        );
      }
    }
  })
  .superRefine((data, ctx) => {
    const { vehicle, payment } = data;

    const minimumPrice = Number(vehicle.minimumPrice) || 0;
    const announcedPrice = Number(vehicle.announcedPrice) || 0;
    const commissionValue = Number(vehicle.commissionValue) || 0;

    if (announcedPrice < minimumPrice) {
      addIssue<VehicleFormInputs>(
        ctx,
        "vehicle.announcedPrice",
        "Preço anunciado menor que o preço mínimo"
      );
    }

    if (commissionValue >= minimumPrice) {
      addIssue<VehicleFormInputs>(
        ctx,
        "vehicle.commissionValue",
        "Comissão maior ou igual ao preço mínimo"
      );
    }

    if (payment.installment === null) return true;

    const value = Number(payment.installment.value) || 0;
    const upfront = Number(payment.upfront[0]?.value) || 0;

    if (minimumPrice <= value + upfront) {
      addIssue<VehicleFormInputs>(
        ctx,
        "vehicle.minimumPrice",
        "Mínimo menor ou igual ao valor de compra"
      );
    }

    if (commissionValue >= minimumPrice - (value + upfront)) {
      addIssue<VehicleFormInputs>(
        ctx,
        "vehicle.commissionValue",
        "Comissão maior ou igual ao lucro"
      );
    }
  });

export const SchemaVehicleExpenseForm = s
  .object({
    payment: s.object({
      observations: s.string().or(s.empty()),
      category: s.enumeration(EXPENSECATEGORY_VALUES),
      competencyDate: s.dateString(),
      upfront: SchemaPayableUpfront,
      installment: SchemaPayableInstallment.nullable(),
    }),
  })
  .superRefine(installmentFieldsRule)
  .superRefine(upfrontFieldsRule);
