import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";

export default function CustomerForm(): ReactNode {
  return (
    <>
      <Input<VehicleSaleFormInputs>
        label="Nome completo"
        name="client.fullName"
      />
      <Input<VehicleSaleFormInputs>
        label="CPF"
        name="client.cpf"
        mask="cpf"
        maxLength={14}
      />
    </>
  );
}
