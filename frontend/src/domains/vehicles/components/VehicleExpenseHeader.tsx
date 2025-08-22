import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import { FetchVehicle } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import selectVehicleInfo from "../utils/selectVehicleInfo";

export default function VehicleExpenseHeader(): ReactNode {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { vehicleId } = useParams();

  async function getVehicleInfo(): Promise<FetchVehicle> {
    // return await safeFetch(`${BACKEND_URL}/vehicle/${vehicleId}`, {
    //   resource: "ACCOUNTS_RECEIVABLE",
    //   action: "READ",
    // });
    return {
      id: 1,
      modelName: "Fusca",
      announcedPrice: "2000000",
      plateNumber: "ABC-1234",
      modelYear: "1970",
      status: "DELIVERED",
      archivedAt: undefined,
    };
  }

  const { data } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: getVehicleInfo,
    select: selectVehicleInfo,
  });

  return (
    <PageHeader
      title={
        data?.modelName
          ? `Gastos do Veículo "${data.modelName}"`
          : "Gastos do Veículo"
      }
    >
      <Button
        label="Voltar"
        iconLeft="ArrowBack"
        onClick={() => navigate("/vehicles")}
        resource="VEHICLE_EXPENSE"
        action="CREATE"
        variant="quaternary"
        data-cy="back-vehicle-expense-button"
      />
      <Button
        label="Adicionar gasto"
        iconLeft="Add"
        onClick={() => navigate(`${pathname}/new`)}
        resource="VEHICLE_EXPENSE"
        action="CREATE"
        color="green"
        data-cy="new-vehicle-expense-button"
      />
    </PageHeader>
  );
}
