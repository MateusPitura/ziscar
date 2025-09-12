import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import {
  PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS,
  PAYMENT_METHODS_RECEIVABLE_TYPE_OPTIONS,
} from "@/domains/global/constants";
import { InstallmentStatus, PaymentMethodPayableType } from "@shared/enums";
import { useEffect, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { INSTALMENT_STATUS } from "../../vehicles/constants";
import { VehicleFormInputs } from "../../vehicles/types";
import DataField from "../components/DataField";
import { removeMask } from "@shared/utils/removeMask";
import { applyMask } from "../utils/applyMask";

interface PaymentFormProperties {
  isAccountReceivable?: boolean;
}

function formatTotalValue(
  installmentValueWatch: string,
  upfrontValueWatch?: string
) {
  const installmentValue = Number(removeMask(installmentValueWatch)) || 0;
  const upfrontValue = Number(removeMask(upfrontValueWatch ?? "0")) || 0;

  const totalValue = installmentValue + upfrontValue;

  return applyMask(totalValue.toString(), "money");
}

export default function PaymentForm({
  isAccountReceivable,
}: PaymentFormProperties): ReactNode {
  const { watch, setValue } = useFormContext<VehicleFormInputs>();
  const statusWatch = watch("payment.installment.status");
  const installmentValueWatch = watch("payment.installment.value");
  const upfrontValueWatch = watch("payment.upfront.0.value");

  useEffect(() => {
    if (statusWatch === InstallmentStatus.PENDING) {
      setValue("payment.installment.paymentDate", "");
      setValue("payment.installment.paymentMethod", "");
    } else if (statusWatch === InstallmentStatus.PAID) {
      setValue("payment.installment.dueDate", "");
      setValue(
        "payment.installment.paymentMethod",
        PaymentMethodPayableType.CREDIT_CARD
      );
    }
  }, [statusWatch, setValue]);

  return (
    <>
      <Input<VehicleFormInputs>
        label="Valor"
        name="payment.installment.value"
        mask="money"
        required
      />
      <Select<VehicleFormInputs>
        label="Status do pagamento"
        name="payment.installment.status"
        options={INSTALMENT_STATUS}
        required
      />
      {statusWatch === InstallmentStatus.PAID ? (
        <>
          <Input<VehicleFormInputs>
            label="Data de pagamento"
            name="payment.installment.paymentDate"
            type="date"
            required
          />
          <Select
            label="Forma de pagamento"
            name="payment.installment.paymentMethod"
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
          name="payment.installment.dueDate"
          type="date"
          required
        />
      )}
      <div className="col-span-full w-fit">
        <DataField
          label="Valor total"
          value={formatTotalValue(installmentValueWatch, upfrontValueWatch)}
          dataCy="payment-total-value"
        />
      </div>
    </>
  );
}
