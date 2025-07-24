import { s } from "@shared/safeZod";

export const SchemaVehicleSaleForm = s.object({
  customer: s.object({
    id: s.id().or(s.empty()),
    fullName: s.fullName(),
    email: s.email(),
  }),
  vehicle: s.object({
    model: s.string(),
    price: s.money(),
    color: s.color(),
    commonCharacteristics: s.checkbox([
      "automaticTransmission",
      "electricWindows",
      "airConditioning",
      "electricLocks",
      "rearViewCamera",
      "airBag",
      "alloyWheel",
    ]),
    newCharacteristics: s.array(
      s.object({
        label: s.string(),
        value: s.string(),
      }),
      10
    ),
  }),
  payment: s.object({
    isUpfront: s.boolean(),
    installments: s.number().positive(),
  }),
});
