import { PaymentMethod } from "@/domains/global/types/model";
import safeFormat from "@/domains/global/utils/safeFormat";

export default function selectPaymentMethodInfo(
  payload: PaymentMethod
): PaymentMethod {
  return {
    ...payload,
    paymentDate:
      safeFormat({ date: payload.paymentDate, format: "dd/MM/yyyy" }) ?? "",
  };
}
