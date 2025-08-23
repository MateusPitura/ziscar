import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import Section from "@/domains/global/components/Section";
import { PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS } from "@/domains/global/constants";
import { InstallmentStatus } from "@shared/enums";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { INSTALMENT_STATUS } from "../constants";
import { NewVehicleFormInputs } from "../types";

export default function VehiclePurchaseForm(): ReactNode {
  const { watch } = useFormContext<NewVehicleFormInputs>();
  const statusWatch = watch("purchase.installment.status");

  return (
    <>
      <Section.Group>
        {/* 🌠 split in two forms */}
        <Section.Header title="Informações da compra" />
        <Section.Body>
          <Input<NewVehicleFormInputs>
            label="Data de compra"
            name="purchase.purchaseDate"
            type="date"
            required
          />
          <Input<NewVehicleFormInputs>
            label="Comprado de"
            name="purchase.paidTo"
          />
        </Section.Body>
      </Section.Group>
      <Section.Group>
        <Section.Header title="Informações do pagamento" />
        <Section.Body>
          <Input<NewVehicleFormInputs>
            label="Valor"
            name="purchase.installment.value"
            mask="money"
            required
          />
          <Select<NewVehicleFormInputs> // 🌠 when change reset others field
            label="Status do pagamento"
            name="purchase.installment.status"
            options={INSTALMENT_STATUS}
            required
          />
          {statusWatch === InstallmentStatus.PAID ? (
            <>
              <Input<NewVehicleFormInputs>
                label="Data de pagamento"
                name="purchase.installment.dueDate"
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
              name="purchase.installment.paymentDate"
              type="date"
              required
            />
          )}
        </Section.Body>
      </Section.Group>
    </>
  );
}
