import Search from "@/design-system/Form/Search";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { FetchModel } from "@/domains/global/types/model";
import { s } from "@shared/safeZod";
import type { ReactNode } from "react";
import { VehicleFormInputs } from "../types";
import selectModelInfo from "../utils/selectModelInfo";

export default function VehicleModelSearch(): ReactNode {
  const { safeFetch } = useSafeFetch();

  async function getPaidToInfo(filter?: string): Promise<FetchModel[]> {
    if (!filter) return [];

    const result = await safeFetch(
      `${BACKEND_URL}/vehicles/model?modelName=${filter}`,
      {
        resource: "VEHICLES",
        action: "READ",
      }
    );

    return result.data;
  }

  return (
    <Search<VehicleFormInputs, FetchModel[]>
      label="Modelo"
      name="vehicle.modelName"
      fetchCallback={getPaidToInfo}
      queryKey="vehicle-model"
      labelKey="modelName"
      valueKey="id"
      variant="autocomplete"
      select={selectModelInfo}
      formatSearch={(search) => {
        const result = s.string().safeParse(search);
        if (result.success) {
          return result.data.trim();
        }
        return undefined;
      }}
    />
  );
}
