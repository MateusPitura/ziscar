import Input from "@/design-system/Form/Input";
import Search from "@/design-system/Form/Search";
import DataField from "@/domains/global/components/DataField";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { FetchPaidTo } from "@/domains/global/types/model";
import { s } from "@shared/safeZod";
import type { ReactNode } from "react";
import { VehicleFormInputs } from "../types";
import selectPaidToInfo from "../utils/selectPaidToInfo";

interface VehiclePurchaseDetailsFormProps {
  value?: string;
}

export default function VehiclePurchaseDetailsForm({
  value,
}: VehiclePurchaseDetailsFormProps): ReactNode {
  const { safeFetch } = useSafeFetch();

  async function getPaidToInfo(filter?: string): Promise<FetchPaidTo[]> {
    if (!filter) return [];

    const result = await safeFetch(
      `${BACKEND_URL}/vehicles/paid-to?paidTo=${filter}`,
      {
        resource: "VEHICLES",
        action: "READ",
      }
    );

    return result.data;
  }

  return (
    <>
      <Input<VehicleFormInputs>
        label="Data de compra"
        name="payment.purchaseDate"
        type="date"
        required
      />
      <Search<VehicleFormInputs, FetchPaidTo[]>
        label="Comprado de"
        name="payment.paidTo"
        fetchCallback={getPaidToInfo}
        queryKey="paid-to"
        variant="autocomplete"
        labelKey="paidTo"
        valueKey="id"
        select={selectPaidToInfo}
        formatSearch={(search) => {
          const result = s.string().safeParse(search);
          if (result.success) {
            return result.data.trim();
          }
          return undefined;
        }}
      />
      {value && <DataField label="Valor de compra" value={value} />}
    </>
  );
}
