import {
  EXPENSECATEGORY_VALUES,
  FUELTYPE_VALUES,
  INSTALLMENTSTATUS_VALUES,
  PAYMENTMETHODPAYABLETYPE_VALUES, VEHICLECATEGORY_VALUES,
  VEHICLESTATUS_VALUES
} from "@shared/enums";
import { s } from "@shared/safeZod";

export const SchemaVehiclesFilterForm = s
  .object({
    // name: s.string().or(s.empty()),
    // orderBy: s.enumeration(["name", "email"]),
    // status: s.enumeration(["active", "inactive"]),
    startDate: s.dateString().or(s.empty()),
    endDate: s.dateString().or(s.empty()),
  })
  .refine(...s.dateRangeRule);

export const SchemaNewVehicleForm = s.object({
  purchase: s.object({
    purchaseDate: s.paymentDate(),
    paidTo: s.string().or(s.empty()),
    installment: s.object({
      dueDate: s.paymentDate(),
      value: s.money(),
      status: s.enumeration(INSTALLMENTSTATUS_VALUES),
      paymentDate: s.paymentDate(),
      paymentMethod: s.enumeration(PAYMENTMETHODPAYABLETYPE_VALUES),
    }),
  }),
  vehicle: s.object({
    plateNumber: s.string(), // 🌠 validação para placa,
    chassiNumber: s.string(), // 🌠 validação para chassi
    announcedPrice: s.money(),
    minimumPrice: s.money(),
    commissionValue: s.money(),
    storeId: s.string(),
    kilometers: s.number(), // 🌠 validação da kilometragem
    modelName: s.string(),
    brandId: s.string(),
    color: s.string(),
    modelYear: s.string(), // 🌠 validação para ano do modelo
    yearOfManufacture: s.string(), // 🌠 validação para ano de fabricação
    fuelType: s.enumeration(FUELTYPE_VALUES),
    status: s.enumeration(VEHICLESTATUS_VALUES),
    category: s.enumeration(VEHICLECATEGORY_VALUES),
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
});

export const SchemaVehicleExpenseForm = s.object({
  observations: s.string(),
  category: s.enumeration(EXPENSECATEGORY_VALUES),
  payment: s.object({
    dueDate: s.paymentDate(),
    value: s.money(),
    status: s.enumeration(INSTALLMENTSTATUS_VALUES),
    paymentDate: s.paymentDate(),
    paymentMethod: s.enumeration(PAYMENTMETHODPAYABLETYPE_VALUES),
  }),
});
