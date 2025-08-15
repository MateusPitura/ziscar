import { s } from "@shared/safeZod";

export const SchemaVehicleSaleForm = s.object({
  customer: s.object({
    id: s.string(),
  }),
  vehicle: s.object({
    model: s.string(),
    price: s.money(),
    color: s.color(),
    commonCharacteristics: s.checkbox([
      "Direção hidráulica",
      "Janelas elétricas",
      "Ar condicionado",
      "Travas elétricas",
      "Câmera de ré",
      "Air bag",
      "Rodas de liga leve",
    ]),
    characteristics: s.array(
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
