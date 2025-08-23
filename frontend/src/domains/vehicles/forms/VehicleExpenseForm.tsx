import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import Section from "@/domains/global/components/Section";
import { PAYMENT_METHODS_PAYABLE_TYPE_OPTIONS } from "@/domains/global/constants";
import {
  ExpenseCategory,
  InstallmentStatus,
  PaymentMethodPayableType,
} from "@shared/enums";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { ExpenseCategoryText, INSTALMENT_STATUS } from "../constants";
import { VehicleExpenseFormInputs } from "../types";

export default function VehicleExpenseForm(): ReactNode {
  const { watch, setValue } = useFormContext<VehicleExpenseFormInputs>();
  const statusWatch = watch("payment.status");

  return (
    <>
      <Section.Group>
        {/* 🌠 split in two forms */}
        <Section.Header title="Informações do gasto" />
        <Section.Body>
          <Select<VehicleExpenseFormInputs>
            label="Categoria"
            name="category"
            required
            options={Object.values(ExpenseCategory).map((category) => ({
              label: ExpenseCategoryText[category],
              value: category,
            }))}
          />
          <Input<VehicleExpenseFormInputs>
            label="Detalhes"
            name="observations"
            required
          />
        </Section.Body>
      </Section.Group>
      <Section.Group>
        <Section.Header title="Informações do pagamento" />
        <Section.Body>
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
            onChange={(status) => {
              if (status === InstallmentStatus.PENDING) {
                setValue("payment.paymentDate", "");
                setValue(
                  "payment.paymentMethod",
                  PaymentMethodPayableType.CREDIT_CARD
                );
              } else if (status === InstallmentStatus.PAID) {
                setValue("payment.dueDate", "");
              }
            }}
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
        </Section.Body>
      </Section.Group>
    </>
  );
}
