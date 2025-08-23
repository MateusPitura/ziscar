import {
  EXPENSECATEGORY_VALUES,
  FUELTYPE_VALUES,
  INSTALLMENTSTATUS_VALUES,
  PAYMENTMETHODPAYABLETYPE_VALUES,
  VEHICLECATEGORY_VALUES,
  VEHICLESTATUS_VALUES,
} from "@shared/enums";
import { s } from "@shared/safeZod";
import { MODEL_YEARS, YEARS_OF_MANUFACTURE } from "../constants";
import { addIssue } from "@/domains/global/schemas";
import { NewVehicleFormInputs, VehicleExpenseFormInputs } from "../types";

export const SchemaVehiclesFilterForm = s
  .object({
    // name: s.string().or(s.empty()),
    // status: s.enumeration(["active", "inactive"]),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaNewVehicleForm = s
  .object({
    purchase: s.object({
      purchaseDate: s.paymentDate(),
      paidTo: s.string().or(s.empty()),
      installment: s.object({
        value: s.numberString(),
        status: s.enumeration(INSTALLMENTSTATUS_VALUES),
        dueDate: s.paymentDate().or(s.empty()),
        paymentDate: s.paymentDate().or(s.empty()),
        paymentMethod: s
          .enumeration(PAYMENTMETHODPAYABLETYPE_VALUES)
          .or(s.empty()),
      }),
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
      brandId: s.string().or(s.empty()),
      color: s.string().or(s.empty()),
      modelYear: s.enumeration(MODEL_YEARS).or(s.empty()),
      yearOfManufacture: s.enumeration(YEARS_OF_MANUFACTURE).or(s.empty()),
      fuelType: s.enumeration(FUELTYPE_VALUES).or(s.empty()),
      status: s.enumeration(VEHICLESTATUS_VALUES),
      category: s.enumeration(VEHICLECATEGORY_VALUES).or(s.empty()),
    }),
    characteristics: s.object({
      commonCharacteristics: s.checkbox([
        "Direção hidráulica",
        "Janelas elétricas",
        "Ar condicionado",
        "Travas elétricas",
        "Câmera de ré",
        "Air bag",
        "Rodas de liga leve",
      ]),
      newCharacteristics: s.array(
        s.object({
          description: s.string(),
        }),
        10
      ),
    }),
  })
  .superRefine((data, ctx) => {
    const { status, paymentDate, paymentMethod, dueDate } =
      data.purchase.installment;

    if (status === "PAID") {
      if (paymentDate === "") {
        addIssue<NewVehicleFormInputs>(ctx, "purchase.installment.paymentDate");
      }
      if (paymentMethod === "") {
        addIssue<NewVehicleFormInputs>(
          ctx,
          "purchase.installment.paymentMethod"
        );
      }
    } else if (status === "PENDING") {
      if (dueDate === "") {
        addIssue<NewVehicleFormInputs>(ctx, "purchase.installment.dueDate");
      }
    }
    return true;
  });

export const SchemaVehicleExpenseForm = s
  .object({
    observations: s.string(),
    category: s.enumeration(EXPENSECATEGORY_VALUES),
    payment: s.object({
      value: s.numberString(),
      status: s.enumeration(INSTALLMENTSTATUS_VALUES),
      dueDate: s.paymentDate().or(s.empty()),
      paymentDate: s.paymentDate().or(s.empty()),
      paymentMethod: s
        .enumeration(PAYMENTMETHODPAYABLETYPE_VALUES)
        .or(s.empty()),
    }),
  })
  .superRefine((data, ctx) => {
    const { status, paymentDate, paymentMethod, dueDate } = data.payment;

    if (status === "PAID") {
      if (paymentDate === "") {
        addIssue<VehicleExpenseFormInputs>(ctx, "payment.paymentDate");
      }
      if (paymentMethod === "") {
        addIssue<VehicleExpenseFormInputs>(ctx, "payment.paymentMethod");
      }
    } else if (status === "PENDING") {
      if (dueDate === "") {
        addIssue<VehicleExpenseFormInputs>(ctx, "payment.dueDate");
      }
    }
    return true;
  });
