import type { ReactNode } from "react";
import VehicleExpenseHeader from "./VehicleExpenseHeader";
import VehicleExpenseTable from "./VehicleExpenseTable";
import Spinner from "@/design-system/Spinner";
import { useIsFetching } from "@tanstack/react-query";

export default function VehicleExpenseContainer(): ReactNode {
  const isFetching = useIsFetching({
    queryKey: ["vehicle"],
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
      <VehicleExpenseHeader title="Gastos do Veículo" showActions/>
      <VehicleExpenseTable />
    </div>
  );
}
