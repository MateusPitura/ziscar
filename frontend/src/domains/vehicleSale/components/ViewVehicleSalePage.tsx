import Button from "@/design-system/Button";
import Spinner from "@/design-system/Spinner";
import Tabs from "@/design-system/Tabs";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import formatVehicleCharacteristics from "@/domains/global/utils/formatVehicleCharacteristics";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VehicleSaleDetails } from "../types";
import selectVehicleSaleInfo from "../utils/selectVehicleSaleInfo";
import CustomerData from "./CustomerData";
import VehicleData from "./VehicleData";


type SaleTabs = "VEHICLE" | "CUSTOMER" | "PROFIT";

const enableProfitTab = false;

export default function ViewVehicleSalePage({ contextHelper}: ContextHelperable): ReactNode {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SaleTabs>("VEHICLE");

  const { safeFetch } = useSafeFetch();
  const { vehicleSaleId } = useParams();

  async function getVehicle(): Promise<VehicleSaleDetails> {
    const response = await safeFetch(
      `${BACKEND_URL}/vehicles/sale/${vehicleSaleId}`,
      {
        resource: "VEHICLES",
        action: "READ",
      }
    );

    const { customerSnapshot, vehicleSnapshot } = response;

    return {
      customer: customerSnapshot,
      vehicle: {
        ...vehicleSnapshot,
        vehicleCharacteristicValues: formatVehicleCharacteristics({
          vehicleCharacteristicValues:
            vehicleSnapshot.vehicleCharacteristicValues,
        }),
      },
    };
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
        <PageHeader title="Detalhes da Venda" contextHelper={contextHelper}>
          <Button
            label="Voltar"
            iconLeft="ArrowBack"
            onClick={() => navigate("/accounts-receivable")}
            resource="ACCOUNTS_RECEIVABLE"
            action="READ"
            variant="quaternary"
            data-cy="back-vehicle-sale-button"
            tooltipMessage="Página anterior"
          />
        </PageHeader>
        <Tabs>
          <Tabs.Header>
            <Tabs.Tab
              isActive={activeTab === "VEHICLE"}
              title="Veículo"
              onClick={() => setActiveTab("VEHICLE")}
              resource="VEHICLE_SALE"
              action="READ"
            />
            <Tabs.Tab
              isActive={activeTab === "CUSTOMER"}
              title="Cliente"
              onClick={() => setActiveTab("CUSTOMER")}
              resource="VEHICLE_SALE"
              action="READ"
            />
            {enableProfitTab && (
              <Tabs.Tab
                isActive={activeTab === "PROFIT"}
                title="Rentabilidade"
                onClick={() => setActiveTab("PROFIT")}
                resource="VEHICLE_SALE"
                action="READ"
              />
            )}
          </Tabs.Header>
          <Tabs.Body>
            <Tabs.Section isActive={activeTab === "VEHICLE"}>
              <Section>
                <Section.Group>
                  <Section.Header title="Dados do veículo" />
                  <Section.Body className="grid-cols-3">
                    <VehicleData vehicleData={vehicleData.vehicle} />
                  </Section.Body>
                </Section.Group>
              </Section>
            </Tabs.Section>
            <Tabs.Section isActive={activeTab === "CUSTOMER"}>
              <Section>
                <Section.Group>
                  <Section.Header title="Dados do cliente" />
                  <Section.Body className="grid-cols-2">
                    <CustomerData customerData={vehicleData.customer} />
                  </Section.Body>
                </Section.Group>
              </Section>
            </Tabs.Section>
            <Tabs.Section isActive={activeTab === "PROFIT"}></Tabs.Section>
          </Tabs.Body>
        </Tabs>
      </div>
    )
  );
}
