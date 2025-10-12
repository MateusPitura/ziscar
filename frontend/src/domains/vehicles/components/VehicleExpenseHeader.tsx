import Button from "@/design-system/Button";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { VehicleWithPayment } from "@/domains/global/types/model";
import formatVehicleCharacteristics from "@/domains/global/utils/formatVehicleCharacteristics";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import selectVehicleInfo from "../utils/selectVehicleInfo";

interface VehicleExpenseHeaderProps extends ContextHelperable {
  title: string;
  showActions?: boolean;
}

export default function VehicleExpenseHeader({
  title,
  showActions,
  contextHelper
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

    const { vehicleCharacteristicValues, ...vehicle } = response;

    return {
      payment: null,
      vehicle: {
        ...vehicle,
        vehicleCharacteristicValues: formatVehicleCharacteristics({
          vehicleCharacteristicValues,
        }),
      },
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
        data?.vehicle.plateNumber ? `${title} "${data.vehicle.plateNumber}"` : title
      }
      contextHelper={contextHelper}
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
