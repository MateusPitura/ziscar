import {
  addIssue,
  paymentFieldsRule,
  SchemaPayableInstallment,
} from "@/domains/global/schemas";
import {
  EXPENSECATEGORY_VALUES,
  FUELTYPE_VALUES,
  VEHICLECATEGORY_VALUES,
  VEHICLESTATUS_VALUES,
} from "@shared/enums";
import { s } from "@shared/safeZod";
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
  })
  .refine(...s.dateRangeRule);

export const SchemaVehicleForm = s
  .object({
    payment: s.object({
      purchaseDate: s.paymentDate(),
      paidTo: s.string().or(s.empty()),
      installment: SchemaPayableInstallment.nullable(),
    }),
    vehicle: s.object({
      plateNumber: s.plateNumber(),
      chassiNumber: s.chassi(),
      announcedPrice: s.numberString(),
      minimumPrice: s.numberString(),
      commissionValue: s.numberString(0),
      storeId: s.string(),
      kilometers: s.numberString(0, 1_000_000),
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
  .superRefine(paymentFieldsRule)
  .superRefine((data, ctx) => {
    const { modelYear, yearOfManufacture } = data.vehicle;

    if (modelYear !== "" && yearOfManufacture !== "") {
      if (Number(modelYear) < Number(yearOfManufacture)) {
        addIssue<VehicleFormInputs>(
          ctx,
          "vehicle.modelYear",
          "O ano do modelo deve ser maior ou igual ao ano de fabricação"
        );
      }
    }
  })
  .superRefine((data, ctx) => {
    const { vehicle, payment: purchase } = data;

    if (purchase.installment === null) return true;

    if (Number(vehicle.minimumPrice) <= Number(purchase.installment.value)) {
      addIssue<VehicleFormInputs>(
        ctx,
        "vehicle.minimumPrice",
        "Preço mínimo menor que o valor de compra"
      );
    }

    if (Number(vehicle.announcedPrice) < Number(vehicle.minimumPrice)) {
      addIssue<VehicleFormInputs>(
        ctx,
        "vehicle.announcedPrice",
        "Preço anunciado menor que o preço mínimo"
      );
    }

    if (
      Number(vehicle.commissionValue) >=
      Number(vehicle.minimumPrice) - Number(purchase.installment.value)
    ) {
      addIssue<VehicleFormInputs>(
        ctx,
        "vehicle.commissionValue",
        "Comissão maior que o lucro"
      );
    }
  });

export const SchemaVehicleExpenseForm = s
  .object({
    payment: s.object({
      observations: s.string().or(s.empty()),
      category: s.enumeration(EXPENSECATEGORY_VALUES),
      competencyDate: s.dateString(),
      installment: SchemaPayableInstallment.nullable(),
    }),
  })
  .superRefine(paymentFieldsRule);
