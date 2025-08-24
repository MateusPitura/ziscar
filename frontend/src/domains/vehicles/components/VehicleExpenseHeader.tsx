import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import { Vehicle } from "@/domains/global/types/model";
import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import selectVehicleInfo from "../utils/selectVehicleInfo";

export default function VehicleExpenseHeader(): ReactNode {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { vehicleId } = useParams();

  async function getVehicleInfo(): Promise<Vehicle> {
    // return await safeFetch(`${BACKEND_URL}/vehicle/${vehicleId}`, {
    //   resource: "ACCOUNTS_RECEIVABLE",
    //   action: "READ",
    // });
    return {
      id: 1,
      modelName: "Fusca",
      announcedPrice: "800000000",
      plateNumber: "ABC1234",
      modelYear: "1970",
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
      commissionValue: "0",
      fuelType: FuelType.FLEX,
      kilometers: 0,
      minimumPrice: "0",
      yearOfManufacture: "1970",
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
        data?.vehicle.modelName
          ? `Gastos do Veículo "${data.vehicle.modelName}"`
          : "Gastos do Veículo"
      }
    >
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
    </PageHeader>
  );
}
