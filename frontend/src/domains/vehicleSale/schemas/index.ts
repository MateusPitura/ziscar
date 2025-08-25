import { addIssue, paymentFieldsRule, SchemaReceivableInstallment } from "@/domains/global/schemas";
import { s } from "@shared/safeZod";
import { VehicleSaleFormInputs } from "../types";

interface SchemaVehicleSaleFormProperties {
  minimumPrice?: string;
  commissionValue?: string;
}

export function SchemaVehicleSaleForm({
  commissionValue,
  minimumPrice,
}: SchemaVehicleSaleFormProperties = {}) {
  return s
    .object({
      customer: s.object({
        id: s.string(),
      }),
      payment: s.object({
        installment: SchemaReceivableInstallment,
      }),
    })
    .superRefine(paymentFieldsRule)
    .superRefine((data, ctx) => {
      const commission = Number(commissionValue?.replace(/\D/g, "") ?? 0);
      const minimum = Number(minimumPrice?.replace(/\D/g, "") ?? 0);

      if (Number(data.payment.installment.value) <= minimum + commission) {
        addIssue<VehicleSaleFormInputs>(
          ctx,
          "payment.installment.value",
          "Valor menor que o preço mínimo mais a comissão"
        );
      }
    });
}

export const cpfSearchSchema = s
  .string()
  .regex(/^[0-9.-]+$/)
  .transform((value) => value.replace(/\D/g, ""));
