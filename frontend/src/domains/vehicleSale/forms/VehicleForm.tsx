import Input from "@/design-system/Form/Input";
import { useMemo, type ReactNode } from "react";
import { VehicleSaleFormInputs } from "../types";
import ColorPicker from "@/design-system/ColorPicker";
import Select from "@/design-system/Form/Select";
import { FetchStore } from "@/domains/global/types/model";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { BACKEND_URL } from "@/domains/global/constants";
import { useQuery } from "@tanstack/react-query";
import selectStoresInfo from "@/domains/stores/utils/selectStoresInfo";
import { PageablePayload } from "@/domains/global/types";

export default function VehicleForm(): ReactNode {
  const { safeFetch } = useSafeFetch();

  async function getStoresInfo(): Promise<PageablePayload<FetchStore>> {
    return await safeFetch(`${BACKEND_URL}/store?orderBy=name`, {
      resource: "STORES",
      action: "READ",
    });
  }

  const { data: storesInfo, isFetching: isFetchingStoresInfo } = useQuery({
    queryKey: ["stores"],
    queryFn: getStoresInfo,
    select: selectStoresInfo,
  });

  const dataFormatted = useMemo(() => {
    if (!storesInfo?.data) return [];

    return storesInfo.data.map((item) => ({
      label: String(item.name),
      value: String(item.id),
    }));
  }, [storesInfo]);

  return (
    <>
      <Input<VehicleSaleFormInputs> label="Modelo" name="vehicle.model" />
      <Input<VehicleSaleFormInputs>
        label="Preço de venda"
        name="vehicle.price"
        mask="money"
      />
      <ColorPicker<VehicleSaleFormInputs>
        name="vehicle.color"
        label="Cor do veículo"
        required
      />
      <Select<VehicleSaleFormInputs>
        label="Loja"
        name="vehicle.storeId"
        options={dataFormatted}
        loading={isFetchingStoresInfo}
        required
      />
    </>
  );
}
