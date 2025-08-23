import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import { PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS } from "@/domains/global/constants";
import { InstallmentStatus, PaymentMethodPayableType } from "@shared/enums";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { INSTALMENT_STATUS } from "../constants";
import { NewVehicleFormInputs } from "../types";

export default function VehiclePurchasePaymentForm(): ReactNode {
  const { watch, setValue } = useFormContext<NewVehicleFormInputs>();
  const statusWatch = watch("purchase.installment.status");

  return (
    <>
      <Input<NewVehicleFormInputs>
        label="Valor"
        name="purchase.installment.value"
        mask="money"
        required
      />
      <Select<NewVehicleFormInputs>
        label="Status do pagamento"
        name="purchase.installment.status"
        options={INSTALMENT_STATUS}
        required
        onChange={(status) => {
          if (status === InstallmentStatus.PENDING) {
            setValue("purchase.installment.paymentDate", "");
            setValue(
              "purchase.installment.paymentMethod",
              PaymentMethodPayableType.CREDIT_CARD
            );
          } else if (status === InstallmentStatus.PAID) {
            setValue("purchase.installment.dueDate", "");
          }
        }}
      />
      {statusWatch === InstallmentStatus.PAID ? (
        <>
          <Input<NewVehicleFormInputs>
            label="Data de pagamento"
            name="purchase.installment.paymentDate"
            type="date"
            required
          />
          <Select<NewVehicleFormInputs>
            label="Forma de pagamento"
            name="purchase.installment.paymentMethod"
            options={PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS}
            required
          />
        </>
      ) : (
        <Input<NewVehicleFormInputs>
          label="Data de vencimento"
          name="purchase.installment.dueDate"
          type="date"
          required
        />
      )}
    </>
  );
}
