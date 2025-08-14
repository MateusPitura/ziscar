import Tabs from "@/design-system/Tabs";
import { useState, type ReactElement } from "react";
import { VehicleSaleFormInputs } from "../types";
import { useFormState } from "react-hook-form";
import Section from "@/domains/global/components/Section";
import CustomerForm from "../forms/CustomerForm";
import VehicleForm from "../forms/VehicleForm";
import PaymentForm from "../forms/PaymentForm";
import CustomerSearchForm from "../forms/CustomerSearchForm";
import VehicleCommonCharacteristicForm from "../forms/VehicleCommonCharacteristicForm";
import VehicleNewCharacteristicForm from "../forms/VehicleNewCharacteristicForm";

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
          hasError={!!errors?.customer}
          resource="VEHICLE_SALE"
          action="CREATE"
        />
        <Tabs.Tab
          isActive={activeTab === "VEHICLE"}
          title="Veículo"
          onClick={() => setActiveTab("VEHICLE")}
          hasError={!!errors?.vehicle}
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
                <CustomerForm />
              </Section.Body>
            </Section.Group>
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "VEHICLE"}>
          <Section>
            <Section.Group>
              <Section.Header title="Informações" />
              <Section.Body>
                <VehicleForm />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Selecione características comuns" />
              <Section.Body>
                <VehicleCommonCharacteristicForm />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Adicione características" />
              <Section.Body>
                <VehicleNewCharacteristicForm />
              </Section.Body>
            </Section.Group>
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "PAYMENT"}>
          <Section>
            <Section.Group>
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
