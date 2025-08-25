import { addIssue } from "@/domains/global/schemas";
import {
  INSTALLMENTSTATUS_VALUES,
  PAYMENTMETHODRECEIVABLETYPE_VALUES,
} from "@shared/enums";
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
        installment: s.object({
          value: s.numberString(),
          status: s.enumeration(INSTALLMENTSTATUS_VALUES),
          dueDate: s.paymentDate().or(s.empty()),
          paymentDate: s.paymentDate().or(s.empty()),
          paymentMethod: s
            .enumeration(PAYMENTMETHODRECEIVABLETYPE_VALUES)
            .or(s.empty()),
        }),
      }),
    })
    .superRefine((data, ctx) => {
      const { status, paymentDate, paymentMethod, dueDate } =
        data.payment.installment;

      if (status === "PAID") {
        if (paymentDate === "") {
          addIssue<VehicleSaleFormInputs>(
            ctx,
            "payment.installment.paymentDate"
          );
        }
        if (paymentMethod === "") {
          addIssue<VehicleSaleFormInputs>(
            ctx,
            "payment.installment.paymentMethod"
          );
        }
      } else if (status === "PENDING") {
        if (dueDate === "") {
          addIssue<VehicleSaleFormInputs>(ctx, "payment.installment.dueDate");
        }
      }
      return true;
    })
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
