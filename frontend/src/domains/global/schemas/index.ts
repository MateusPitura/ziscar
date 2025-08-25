import { VehicleFormInputs } from "@/domains/vehicles/types";
import {
  BRAZILIANSTATE_VALUES,
  INSTALLMENTSTATUS_VALUES,
  PAYMENTMETHODPAYABLETYPE_VALUES,
  PAYMENTMETHODRECEIVABLETYPE_VALUES,
} from "@shared/enums";
import { s } from "@shared/safeZod";
import { FieldValues, Path } from "react-hook-form";
import { PaymentFieldRuleData } from "../types";

export const SchemaAddress = s.SchemaAddress.extend({
  street: s.string().or(s.empty()),
  neighborhood: s.string().or(s.empty()),
  cityIbgeCode: s.string().or(s.empty()),
  state: s.enumeration(BRAZILIANSTATE_VALUES).or(s.empty()),
});

const SchemaInstallment = s.object({
  value: s.numberString(),
  status: s.enumeration(INSTALLMENTSTATUS_VALUES),
  dueDate: s.paymentDate().or(s.empty()),
  paymentDate: s.paymentDate().or(s.empty()),
});

export const SchemaPayableInstallment = SchemaInstallment.extend({
  paymentMethod: s.enumeration(PAYMENTMETHODPAYABLETYPE_VALUES).or(s.empty()),
});

export const SchemaReceivableInstallment = SchemaInstallment.extend({
  paymentMethod: s
    .enumeration(PAYMENTMETHODRECEIVABLETYPE_VALUES)
    .or(s.empty()),
});

export function addIssue<T extends FieldValues>(
  ctx: s.RefinementCtx,
  path: Path<T>,
  message: string = "Campo obrigatório"
) {
  ctx.addIssue({
    code: "custom",
    message,
    path: path.split("."),
  });
}

export function paymentFieldsRule(
  data: PaymentFieldRuleData,
  ctx: s.RefinementCtx
) {
  if (data.payment.installment === null) return true;

  const { status, paymentDate, paymentMethod, dueDate } =
    data.payment.installment;

  if (status === "PAID") {
    if (paymentDate === "") {
      addIssue<VehicleFormInputs>(ctx, "payment.installment.paymentDate");
    }
    if (paymentMethod === "") {
      addIssue<VehicleFormInputs>(ctx, "payment.installment.paymentMethod");
    }
  } else if (status === "PENDING") {
    if (dueDate === "") {
      addIssue<VehicleFormInputs>(ctx, "payment.installment.dueDate");
    }
  }
}
