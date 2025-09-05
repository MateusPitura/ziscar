import Input from "@/design-system/Form/Input";
import type { ReactNode } from "react";
import { VehicleFormInputs } from "../types";
import DataField from "@/domains/global/components/DataField";

interface VehiclePurchaseDetailsFormProps {
  value?: string;
}

export default function VehiclePurchaseDetailsForm({
  value,
}: VehiclePurchaseDetailsFormProps): ReactNode {
  return (
    <>
      <Input<VehicleFormInputs>
        label="Data de compra"
        name="payment.purchaseDate"
        type="date"
        required
      />
      <Input<VehicleFormInputs> label="Comprado de" name="payment.paidTo" />
      {value && <DataField label="Valor de compra" value={value} />}
    </>
  );
}
