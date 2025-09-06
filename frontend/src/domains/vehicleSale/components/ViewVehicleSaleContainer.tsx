import Button from "@/design-system/Button";
import Spinner from "@/design-system/Spinner";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { Vehicle } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import selectVehicleSaleInfo from "../utils/selectVehicleSaleInfo";
import VehicleData from "./VehicleData";

export default function ViewVehicleSaleContainer(): ReactNode {
  const navigate = useNavigate();

  const { safeFetch } = useSafeFetch();
  const { vehicleSaleId } = useParams();

  async function getVehicle(): Promise<Vehicle> {
    const response = await safeFetch(`${BACKEND_URL}/vehicles/sale/${vehicleSaleId}`, {
      resource: "VEHICLES",
      action: "READ",
    });

    return response.vehicleSnapshot
  }

  const { data: vehicleData, isFetching } = useQuery({
    queryKey: ["vehicle-sale", vehicleSaleId],
    queryFn: getVehicle,
    select: selectVehicleSaleInfo,
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
