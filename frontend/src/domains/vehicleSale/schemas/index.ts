import {
  addIssue,
  installmentFieldsRule,
  SchemaReceivableInstallment,
  SchemaReceivableUpfront,
  upfrontFieldsRule,
} from "@/domains/global/schemas";
import { applyMask } from "@/domains/global/utils/applyMask";
import { s } from "@shared/safeZod";
import { removeMask } from "@shared/utils/removeMask";
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
        saleDate: s.paymentDate(),
        commissionValue: s.numberString({
          min: 0,
          max: commissionValue ? Number(removeMask(commissionValue)) : 0,
          formatter: (value) => applyMask(value, "money") ?? "",
        }),
        upfront: SchemaReceivableUpfront,
        installment: SchemaReceivableInstallment,
      }),
    })
    .superRefine(installmentFieldsRule)
    .superRefine(upfrontFieldsRule)
    .superRefine((data, ctx) => {
      const commission = Number(data.payment.commissionValue) || 0;
      const upfront = Number(data.payment.upfront[0]?.value) || 0;
      const value = Number(data.payment.installment?.value) || 0;

      const minimum = Number(removeMask(minimumPrice ?? "0")) || 0;
      
      if (upfront + value <= minimum + commission) {
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
