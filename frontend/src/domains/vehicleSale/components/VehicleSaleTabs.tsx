import Tabs from "@/design-system/Tabs";
import { useState, type ReactElement } from "react";
import { VehicleSaleFormInputs } from "../types";
import { useFormState } from "react-hook-form";
import Section from "@/domains/global/components/Section";
import CustomerForm from "../forms/CustomerForm";
import VehicleForm from "../forms/VehicleForm";
import PaymentForm from "../forms/PaymentForm";

type VehicleSaleTabs = "CLIENT" | "VEHICLE" | "PAYMENT";

export default function VehicleSaleTabs(): ReactElement {
  const [activeTab, setActiveTab] = useState<VehicleSaleTabs>("CLIENT");
  const { errors } = useFormState<VehicleSaleFormInputs>();

  return (
    <Tabs>
      <Tabs.Header>
        <Tabs.Tab
          isActive={activeTab === "CLIENT"}
          title="Cliente"
          onClick={() => setActiveTab("CLIENT")}
          hasError={!!errors?.client}
        />
        <Tabs.Tab
          isActive={activeTab === "VEHICLE"}
          title="Veículo"
          onClick={() => setActiveTab("VEHICLE")}
          hasError={!!errors?.vehicle}
        />
        <Tabs.Tab
          isActive={activeTab === "PAYMENT"}
          title="Pagamento"
          onClick={() => setActiveTab("PAYMENT")}
          hasError={!!errors?.payment}
        />
      </Tabs.Header>
      <Tabs.Body>
        <Tabs.Section isActive={activeTab === "CLIENT"}>
          <Section>
            <Section.Body>
              <CustomerForm />
            </Section.Body>
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "VEHICLE"}>
          <Section>
            <Section.Body>
              <VehicleForm />
            </Section.Body>
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "PAYMENT"}>
          <Section>
            <Section.Body>
              <PaymentForm />
            </Section.Body>
          </Section>
        </Tabs.Section>
      </Tabs.Body>
    </Tabs>
  );
}
