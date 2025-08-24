import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import { PAYMENT_METHODS_RECEIVABLE_TYPE_OPTIONS } from "@/domains/global/constants";
import { INSTALMENT_STATUS } from "@/domains/vehicles/constants";
import { InstallmentStatus, PaymentMethodReceivableType } from "@shared/enums";
import { useEffect, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { VehicleSaleFormInputs } from "../types";

export default function PaymentForm(): ReactNode {
  const { watch, setValue } = useFormContext<VehicleSaleFormInputs>();
  const statusWatch = watch("payment.installment.status");

  useEffect(() => {
    if (statusWatch === InstallmentStatus.PENDING) {
      setValue("payment.installment.paymentDate", "");
      setValue("payment.installment.paymentMethod", "");
    } else if (statusWatch === InstallmentStatus.PAID) {
      setValue("payment.installment.dueDate", "");
      setValue(
        "payment.installment.paymentMethod",
        PaymentMethodReceivableType.CREDIT_CARD
      );
    }
  }, [statusWatch, setValue]);

  return (
    <>
      <Input<VehicleSaleFormInputs>
        label="Valor"
        name="payment.installment.value"
        mask="money"
        required
      />
      <Select<VehicleSaleFormInputs>
        label="Status do pagamento"
        name="payment.installment.status"
        options={INSTALMENT_STATUS}
        required
      />
      {statusWatch === InstallmentStatus.PAID ? (
        <>
          <Input<VehicleSaleFormInputs>
            label="Data de pagamento"
            name="payment.installment.paymentDate"
            type="date"
            required
          />
          <Select<VehicleSaleFormInputs>
            label="Forma de pagamento"
            name="payment.installment.paymentMethod"
            options={PAYMENT_METHODS_RECEIVABLE_TYPE_OPTIONS}
            required
          />
        </>
      ) : (
        <Input<VehicleSaleFormInputs>
          label="Data de vencimento"
          name="payment.installment.dueDate"
          type="date"
          required
        />
      )}
    </>
  );
}
