import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import { PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS } from "@/domains/global/constants";
import { InstallmentStatus, PaymentMethodPayableType } from "@shared/enums";
import { useEffect, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { INSTALMENT_STATUS } from "../constants";
import { VehicleExpenseFormInputs } from "../types";

export default function VehicleExpensePaymentForm(): ReactNode {
  const { watch, setValue } = useFormContext<VehicleExpenseFormInputs>();
  const statusWatch = watch("payment.status");

  useEffect(() => {
    if (statusWatch === InstallmentStatus.PENDING) {
      setValue("payment.paymentDate", "");
      setValue("payment.paymentMethod", "");
    } else if (statusWatch === InstallmentStatus.PAID) {
      setValue("payment.dueDate", "");
      setValue("payment.paymentMethod", PaymentMethodPayableType.CREDIT_CARD);
    }
  }, [statusWatch, setValue]);

  return (
    <>
      <Input<VehicleExpenseFormInputs>
        label="Valor"
        name="payment.value"
        mask="money"
        required
      />
      <Select<VehicleExpenseFormInputs>
        label="Status do pagamento"
        name="payment.status"
        options={INSTALMENT_STATUS}
        required
      />
      {statusWatch === InstallmentStatus.PAID ? (
        <>
          <Input<VehicleExpenseFormInputs>
            label="Data de pagamento"
            name="payment.paymentDate"
            type="date"
            required
          />
          <Select<VehicleExpenseFormInputs>
            label="Forma de pagamento"
            name="payment.paymentMethod"
            options={PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS}
            required
          />
        </>
      ) : (
        <Input<VehicleExpenseFormInputs>
          label="Data de vencimento"
          name="payment.dueDate"
          type="date"
          required
        />
      )}
    </>
  );
}
