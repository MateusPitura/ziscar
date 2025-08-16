import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { CustomerFormInputs as CustomerFormInputsType } from "../types";

export default function CustomerFormInputs(): ReactNode {
  return (
    <>
      <Input<CustomerFormInputsType>
        name="fullName"
        label="Nome completo"
        required
        autoFocus
      />
      <Input<CustomerFormInputsType>
        name="cpf"
        label="CPF"
        mask="cpf"
        maxLength={18}
        required
      />
      <Input<CustomerFormInputsType> name="email" label="Email" type="email" />
      <Input<CustomerFormInputsType>
        name="phone"
        label="Celular"
        mask="phone"
        maxLength={15}
        type="tel"
      />
    </>
  );
}
