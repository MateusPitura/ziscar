import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import { PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS } from "@/domains/global/constants";
import { InstallmentStatus, PaymentMethodPayableType } from "@shared/enums";
import { useEffect, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { INSTALMENT_STATUS } from "../constants";
import { VehicleFormInputs } from "../types";

export default function VehiclePurchasePaymentForm(): ReactNode {
  const { watch, setValue } = useFormContext<VehicleFormInputs>();
  const statusWatch = watch("purchase.installment.status");

  useEffect(() => {
    if (statusWatch === InstallmentStatus.PENDING) {
      setValue("purchase.installment.paymentDate", "");
      setValue("purchase.installment.paymentMethod", "");
    } else if (statusWatch === InstallmentStatus.PAID) {
      setValue("purchase.installment.dueDate", "");
      setValue(
        "purchase.installment.paymentMethod",
        PaymentMethodPayableType.CREDIT_CARD
      );
    }
  }, [statusWatch, setValue]);

  return (
    <>
      <Input<VehicleFormInputs>
        label="Valor"
        name="purchase.installment.value"
        mask="money"
        required
      />
      <Select<VehicleFormInputs>
        label="Status do pagamento"
        name="purchase.installment.status"
        options={INSTALMENT_STATUS}
        required
      />
      {statusWatch === InstallmentStatus.PAID ? (
        <>
          <Input<VehicleFormInputs>
            label="Data de pagamento"
            name="purchase.installment.paymentDate"
            type="date"
            required
          />
          <Select<VehicleFormInputs>
            label="Forma de pagamento"
            name="purchase.installment.paymentMethod"
            options={PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS}
            required
          />
        </>
      ) : (
        <Input<VehicleFormInputs>
          label="Data de vencimento"
          name="purchase.installment.dueDate"
          type="date"
          required
        />
      )}
    </>
  );
}
