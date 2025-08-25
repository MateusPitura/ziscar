import Spinner from "@/design-system/Spinner";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { Vehicle } from "@/domains/global/types/model";
import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import selectVehicleInfo from "../utils/selectVehicleInfo";
import VehicleData from "./VehicleData";
import Button from "@/design-system/Button";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";

export default function ViewVehicleSaleContainer(): ReactNode {
  const navigate = useNavigate();

  // const { safeFetch } = useSafeFetch();
  const { vehicleSaleId } = useParams();

  async function getVehicle(): Promise<Vehicle> {
    // return await safeFetch(`${BACKEND_URL}/vehicle-sale/${vehicleSaleId}`, {
    //   resource: "VEHICLE_SALE",
    //   action: "READ",
    // });

    return {
      id: 1,
      modelName: "Fusca",
      announcedPrice: "9000000",
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
      color: "#FF0000",
      chassiNumber: "AAAAAAAAAAAAAAAAA",
      commissionValue: "0",
      fuelType: FuelType.FLEX,
      kilometers: "1000",
      minimumPrice: "8000000",
      yearOfManufacture: "1970",
      characteristics: [
        "Direção hidráulica",
        "Janelas elétricas",
        "Ar condicionado",
        "Travas elétricas",
        "Câmera de ré",
        "Air bag",
        "Rodas de liga leve",
      ],
    };
  }

  const { data: vehicleData, isFetching } = useQuery({
    queryKey: ["vehicle-sale", vehicleSaleId],
    queryFn: getVehicle,
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
    vehicleData && (
      <div className="flex flex-col gap-4 w-full">
        <PageHeader title="Detalhes do Veículo Vendido">
          <Button
            label="Voltar"
            iconLeft="ArrowBack"
            onClick={() => navigate("/accounts-receivable")}
            resource="ACCOUNTS_RECEIVABLE"
            action="READ"
            variant="quaternary"
            data-cy="back-vehicle-sale-button"
          />
        </PageHeader>
        <div className="flex justify-center flex-1">
          <Section>
            <Section.Group>
              <Section.Header title="Dados do veículo" />
              <Section.Body className="grid-cols-3">
                <VehicleData vehicleData={vehicleData} />
              </Section.Body>
            </Section.Group>
          </Section>
        </div>
      </div>
    )
  );
}
