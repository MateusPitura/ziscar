import Input from "@/design-system/Form/Input";
import Select from "@/design-system/Form/Select";
import { ExpenseCategory } from "@shared/enums";
import type { ReactNode } from "react";
import { ExpenseCategoryText } from "../constants";
import { VehicleExpenseFormInputs } from "../types";

export default function VehicleExpenseDetailsForm(): ReactNode {
  return (
    <>
      <Select<VehicleExpenseFormInputs>
        label="Categoria"
        name="payment.category"
        required
        options={Object.values(ExpenseCategory).map((category) => ({
          label: ExpenseCategoryText[category],
          value: category,
        }))}
      />
      <Input<VehicleExpenseFormInputs>
        label="Data de competência"
        name="payment.competencyDate"
        type="date"
        required
      />
      <Input<VehicleExpenseFormInputs>
        label="Detalhes"
        name="payment.observations"
      />
    </>
  );
}
