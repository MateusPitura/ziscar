import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import { VehicleWithPayment } from "@/domains/global/types/model";
import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
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

  async function getVehicleInfo(): Promise<VehicleWithPayment> {
    // return await safeFetch(`${BACKEND_URL}/vehicle/${vehicleId}`, { // 🌠 MOCK
    //   resource: "ACCOUNTS_RECEIVABLE",
    //   action: "READ",
    // });
    return {
      payment: {
        purchaseDate: "2023-01-01",
        paidTo: "João da Silva",
      },
      vehicle: {
        id: 1,
        modelName: "Fusca",
        announcedPrice: 800000000,
        plateNumber: "ABC1234",
        modelYear: 1970,
        status: VehicleStatus.DELIVERED,
        archivedAt: undefined,
        brand: {
          id: 10,
          name: "Volkswagen",
        },
        store: {
          id: 1,
          name: "Loja 1",
        },
        category: VehicleCategory.CAR,
        color: "#FFFFFF",
        chassiNumber: "AAAAAAAAAAAAAAAAA",
        commissionValue: 0,
        fuelType: FuelType.FLEX,
        kilometers: 0,
        minimumPrice: 0,
        yearOfManufacture: 1970,
        characteristics: [],
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
