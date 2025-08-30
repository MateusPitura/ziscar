import {
  addIssue,
  paymentFieldsRule,
  SchemaReceivableInstallment,
} from "@/domains/global/schemas";
import { s } from "@shared/safeZod";
import { VehicleSaleFormInputs } from "../types";
import { removeMask } from "@shared/utils/removeMask";
import { applyMask } from "@/domains/global/utils/applyMask";

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
        saleDate: s.paymentDate(),
        commissionValue: s.numberString({
          min: 0,
          max: commissionValue ? Number(removeMask(commissionValue)) : 0,
          formatter: (value) => applyMask(value, "money") ?? "",
        }),
        installment: SchemaReceivableInstallment,
      }),
    })
    .superRefine(paymentFieldsRule)
    .superRefine((data, ctx) => {
      const commission = Number(data.payment.commissionValue) || 0;
      const minimum = Number(removeMask(minimumPrice ?? "0")) || 0;

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
  .transform((value) => removeMask(value));
