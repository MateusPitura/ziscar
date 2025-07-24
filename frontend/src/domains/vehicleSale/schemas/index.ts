import { s } from "@shared/safeZod";

export const SchemaVehicleSaleForm = s.object({
  customer: s.object({
    id: s.id().or(s.empty()),
    fullName: s.fullName(),
    email: s.email(),
  }),
  vehicle: s.object({
    model: s.string(),
    price: s.number().positive(),
    color: s.color()
  }),
  payment: s.object({
    isUpfront: s.boolean(),
    installments: s.number().positive(),
  }),
});
