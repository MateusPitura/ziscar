import { s } from "@shared/safeZod";

export const SchemaVehicleSaleForm = s.object({
  client: s.object({
    fullName: s.fullName(),
    cpf: s.cpf(),
  }),
  vehicle: s.object({
    model: s.string(),
    price: s.number().positive(),
  }),
  payment: s.object({
    isUpfront: s.boolean(),
    installments: s.number().positive(),
  }),
});
