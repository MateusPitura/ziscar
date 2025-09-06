import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { VehicleWithPayment } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import selectVehicleInfo from "../utils/selectVehicleInfo";

interface VehicleExpenseHeaderProps {
  title: string;
  showActions?: boolean;
}

export default function VehicleExpenseHeader({
  title,
  showActions,
}: VehicleExpenseHeaderProps): ReactNode {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { vehicleId } = useParams();
  const { safeFetch } = useSafeFetch();

  async function getVehicleInfo(): Promise<VehicleWithPayment> {
   const response = await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}`, {
      resource: "VEHICLES",
      action: "READ",
    });

    return {
      // 🌠 IMPROVE GET (UNNECESSARY)
      payment: {
        purchaseDate: "2023-01-01",
        paidTo: "Fulano de Tal",
        value: "7000000",
      },
      vehicle: response,
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
        data?.vehicle.modelName ? `${title} "${data.vehicle.modelName}"` : title
      }
    >
      {showActions && (
        <>
          <Button
            label="Voltar"
            iconLeft="ArrowBack"
            onClick={() => navigate("/vehicles")}
            resource="VEHICLES"
            action="READ"
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
        </>
      )}
    </PageHeader>
  );
}
