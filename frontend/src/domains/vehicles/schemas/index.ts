import {
  FUELTYPE_VALUES,
  INSTALLMENTSTATUS_VALUES,
  PAYMENTMETHODRECEIVABLETYPE_VALUES,
  VEHICLECATEGORY_VALUES,
  VEHICLESTATUS_VALUES,
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
      paymentMethod: s.enumeration(PAYMENTMETHODRECEIVABLETYPE_VALUES),
    }),
  }),
  vehicle: s.object({
    kilometers: s.number(), // 🌠 validação
    plateNumber: s.string(), // 🌠 validação para placa,
    announcedPrice: s.money(),
    minimumPrice: s.money(),
    commissionValue: s.money(),
    color: s.string(),
    fuelType: s.enumeration(FUELTYPE_VALUES),
    status: s.enumeration(VEHICLESTATUS_VALUES),
    chassiNumber: s.string(), // 🌠 validação para chassi
    modelYear: s.string(), // 🌠 validação para ano do modelo
    yearOfManufacture: s.string(), // 🌠 validação para ano de fabricação
    modelName: s.string(),
    category: s.enumeration(VEHICLECATEGORY_VALUES),
    storeId: s.string(),
    brandId: s.string(),
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
