import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";
import { useWatch } from "react-hook-form";

export default function CustomerForm(): ReactNode {
  const customerIdWatch = useWatch<VehicleSaleFormInputs>({
    name: "customer.id",
  });

  return (
    <>
      <Input<VehicleSaleFormInputs>
        label="Nome completo"
        name="customer.fullName"
        disabled={!!customerIdWatch}
      />
      <Input<VehicleSaleFormInputs>
        label="Email"
        name="customer.email"
        disabled={!!customerIdWatch}
      />
    </>
  );
}
