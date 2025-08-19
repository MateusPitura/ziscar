import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { VehicleExpenseFormInputs } from "../types";
import Section from "@/domains/global/components/Section";
import Select from "@/design-system/Form/Select";
import { ExpenseCategory, InstallmentStatus } from "@shared/enums";
import { PAYMENT_METHODS } from "@/domains/global/constants";
import Input from "@/design-system/Form/Input";
import { ExpenseCategoryText } from "../constants";

export default function VehicleExpenseForm(): ReactNode {
  const { watch } = useFormContext<VehicleExpenseFormInputs>();
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
          <Select<VehicleExpenseFormInputs> // 🌠 when change reset others field
            label="Status"
            name="payment.status"
            options={[
              {
                label: "Pago",
                value: InstallmentStatus.PAID,
              },
              {
                label: "Pendente",
                value: InstallmentStatus.PENDING,
              },
            ]}
            required
          />
          {statusWatch === InstallmentStatus.PAID ? (
            <>
              <Input<VehicleExpenseFormInputs>
                label="Data de pagamento"
                name="payment.dueDate"
                type="date"
                required
              />
              <Select<VehicleExpenseFormInputs>
                label="Forma de pagamento"
                name="payment.paymentMethod"
                options={PAYMENT_METHODS}
                required
              />
            </>
          ) : (
            <Input<VehicleExpenseFormInputs>
              label="Data de vencimento"
              name="payment.paymentDate"
              type="date"
              required
            />
          )}
        </Section.Body>
      </Section.Group>
    </>
  );
}
