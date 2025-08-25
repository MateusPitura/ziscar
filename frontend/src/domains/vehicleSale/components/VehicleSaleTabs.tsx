import Tabs from "@/design-system/Tabs";
import Section from "@/domains/global/components/Section";
import { useState, type ReactElement } from "react";
import { useFormState } from "react-hook-form";
import CustomerSearchForm from "../forms/CustomerSearchForm";
import PaymentForm from "../forms/PaymentForm";
import { VehicleSaleFormInputs } from "../types";
import CustomerData from "./CustomerData";
import VehicleData from "./VehicleData";
import { Vehicle } from "@/domains/global/types/model";

type VehicleSaleTabs = "CLIENT" | "VEHICLE" | "PAYMENT";

interface VehicleSaleTabsProperties {
  vehicleData: Vehicle;
}

export default function VehicleSaleTabs({
  vehicleData,
}: VehicleSaleTabsProperties): ReactElement {
  const [activeTab, setActiveTab] = useState<VehicleSaleTabs>("VEHICLE");
  const { errors } = useFormState<VehicleSaleFormInputs>();

  return (
    <Tabs>
      <Tabs.Header>
        <Tabs.Tab
          isActive={activeTab === "VEHICLE"}
          title="Veículo"
          onClick={() => setActiveTab("VEHICLE")}
          resource="VEHICLE_SALE"
          action="CREATE"
        />
        <Tabs.Tab
          isActive={activeTab === "CLIENT"}
          title="Cliente"
          onClick={() => setActiveTab("CLIENT")}
          hasError={!!errors?.customer}
          resource="VEHICLE_SALE"
          action="CREATE"
        />
        <Tabs.Tab
          isActive={activeTab === "PAYMENT"}
          title="Pagamento"
          onClick={() => setActiveTab("PAYMENT")}
          hasError={!!errors?.payment}
          resource="VEHICLE_SALE"
          action="CREATE"
        />
      </Tabs.Header>
      <Tabs.Body>
        <Tabs.Section isActive={activeTab === "CLIENT"}>
          <Section>
            <Section.Group>
              <Section.Header title="Busque pelo cliente" />
              <Section.Body>
                <CustomerSearchForm />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Dados do cliente" />
              <Section.Body>
                <CustomerData />
              </Section.Body>
            </Section.Group>
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "VEHICLE"}>
          <Section>
            <Section.Group>
              <Section.Header title="Dados do veículo" />
              <Section.Body className="grid-cols-3">
                <VehicleData vehicleData={vehicleData} />
              </Section.Body>
            </Section.Group>
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "PAYMENT"}>
          <Section>
            <Section.Group>
              <Section.Header title="Informações do pagamento" />
              <Section.Body>
                <PaymentForm />
              </Section.Body>
            </Section.Group>
          </Section>
        </Tabs.Section>
      </Tabs.Body>
    </Tabs>
  );
}
