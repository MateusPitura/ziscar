import FieldArray from "@/design-system/Form/FieldArray";
import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import {
  PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS,
  PAYMENT_METHODS_RECEIVABLE_TYPE_OPTIONS,
} from "@/domains/global/constants";
import { InstallmentStatus, PaymentMethodPayableType } from "@shared/enums";
import { useEffect, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import {
  INSTALMENT_STATUS,
  vehicleDefaultValues,
} from "../../vehicles/constants";
import { VehicleFormInputs } from "../../vehicles/types";

interface UpfrontFormProperties {
  isAccountReceivable?: boolean;
}

export default function UpfrontForm({
  isAccountReceivable,
}: UpfrontFormProperties): ReactNode {
  const { watch, setValue } = useFormContext<VehicleFormInputs>();
  const statusWatch = watch("payment.upfront.0.status");

  useEffect(() => {
    if (statusWatch === InstallmentStatus.PENDING) {
      setValue("payment.upfront.0.paymentDate", "");
      setValue("payment.upfront.0.paymentMethod", "");
    } else if (statusWatch === InstallmentStatus.PAID) {
      setValue("payment.upfront.0.dueDate", "");
      setValue(
        "payment.upfront.0.paymentMethod",
        PaymentMethodPayableType.CREDIT_CARD
      );
    }
  }, [statusWatch, setValue]);

  return (
    <FieldArray<VehicleFormInputs>
      name="payment.upfront"
      appendText="Adicionar entrada"
      removeText="Remover entrada"
      maxLength={1}
      title="Informação da entrada"
      className="grid-cols-3"
      appendDefaultValues={vehicleDefaultValues.payment.installment!}
      render={() => (
        <>
          <Input<VehicleFormInputs>
            label="Valor"
            name="payment.upfront.0.value"
            mask="money"
            required
          />
          <Select<VehicleFormInputs>
            label="Status do pagamento"
            name="payment.upfront.0.status"
            options={INSTALMENT_STATUS}
            required
          />
          {statusWatch === InstallmentStatus.PAID ? (
            <>
              <Input<VehicleFormInputs>
                label="Data de pagamento"
                name="payment.upfront.0.paymentDate"
                type="date"
                required
              />
              <Select
                label="Forma de pagamento"
                name="payment.upfront.0.paymentMethod"
                options={
                  isAccountReceivable
                    ? PAYMENT_METHODS_RECEIVABLE_TYPE_OPTIONS
                    : PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS
                }
                required
              />
            </>
          ) : (
            <Input<VehicleFormInputs>
              label="Data de vencimento"
              name="payment.upfront.0.dueDate"
              type="date"
              required
            />
          )}
        </>
      )}
    />
  );
}
