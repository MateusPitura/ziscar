import {
  INSTALLMENTSTATUS_VALUES,
  PAYMENTMETHODRECEIVABLETYPE_VALUES,
} from "@shared/enums";
import { s } from "@shared/safeZod";

export const SchemaVehicleSaleForm = s.object({
  customer: s.object({
    id: s.string(),
  }),
  vehicle: s.object({
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
});

export const cpfSearchSchema = s
  .string()
  .regex(/^[0-9.-]+$/)
  .transform((value) => value.replace(/\D/g, ""));
