import Search from "@/design-system/Form/Search";
import type { ReactElement } from "react";
import { FetchUser } from "@/domains/global/types/model";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { VehicleSaleFormInputs } from "../types";
import { useFormContext } from "react-hook-form";

export default function CustomerSearchForm(): ReactElement {
  const { safeFetch } = useSafeFetch();

  const { setValue, resetField } = useFormContext<VehicleSaleFormInputs>();

  async function getUsersInfo(filter?: string): Promise<FetchUser[]> {
    if (!filter) return [];

    const result = await safeFetch(`${BACKEND_URL}/user?fullName=${filter}`, {
      resource: "USERS",
      action: "READ",
    });

    return result.data;
  }

  return (
    <>
      <Search<VehicleSaleFormInputs, FetchUser[]>
        label="Nome completo"
        name="customer.id"
        fetchCallback={getUsersInfo}
        queryKey="usersSearch"
        onChange={(value) => {
          if (!value) {
            resetField("customer");
            return;
          }
          setValue("customer", value);
        }}
        labelKey="fullName"
        valueKey="id"
      />
    </>
  );
}
