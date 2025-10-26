import Spinner from "@/design-system/Spinner";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import type { ReactNode } from "react";
import useGetVehicleInfo from "../hooks/useGetVehicleInfo";
import selectVehicleInfo from "../utils/selectVehicleInfo";
import VehicleExpenseHeader from "./VehicleExpenseHeader";
import VehicleExpenseTable from "./VehicleExpenseTable";

export default function VehicleExpensePage({
  contextHelper,
}: ContextHelperable): ReactNode {
  const { data, isFetching } = useGetVehicleInfo({
    select: selectVehicleInfo,
  });

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <VehicleExpenseHeader
        title="Gastos do Veículo"
        showActions
        contextHelper={contextHelper}
        plateNumber={data?.vehicle.plateNumber}
      />
      <VehicleExpenseTable />
    </div>
  );
}
