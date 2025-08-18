import { useState, type ReactNode } from "react";
import { useFormState } from "react-hook-form";
import { NewVehicleFormInputs } from "../types";
import Tabs from "@/design-system/Tabs";
import Section from "@/domains/global/components/Section";
import VehiclePurchaseForm from "../forms/VehiclePurchaseForm";
import NewVehicleForm from "../forms/NewVehicleForm";
import VehicleCommonCharacteristicForm from "@/domains/vehicles/forms/VehicleCommonCharacteristicForm";
import VehicleNewCharacteristicForm from "@/domains/vehicles/forms/VehicleNewCharacteristicForm";

type NewVehicleTabs = "PURCHASE" | "INFORMATION" | "CHARACTERISTICS";

export default function NewVehicleTabs(): ReactNode {
  const [activeTab, setActiveTab] = useState<NewVehicleTabs>("PURCHASE");
  const { errors } = useFormState<NewVehicleFormInputs>();

  return (
    <Tabs>
      <Tabs.Header>
        <Tabs.Tab
          isActive={activeTab === "PURCHASE"}
          title="Compra"
          onClick={() => setActiveTab("PURCHASE")}
          hasError={!!errors?.purchase}
          resource="VEHICLES"
          action="CREATE"
        />
        <Tabs.Tab
          isActive={activeTab === "INFORMATION"}
          title="Veículo"
          onClick={() => setActiveTab("INFORMATION")}
          hasError={!!errors?.vehicle}
          resource="VEHICLES"
          action="CREATE"
        />
        <Tabs.Tab
          isActive={activeTab === "CHARACTERISTICS"}
          title="Características"
          onClick={() => setActiveTab("CHARACTERISTICS")}
          hasError={!!errors?.characteristics}
          resource="VEHICLES"
          action="CREATE"
        />
      </Tabs.Header>
      <Tabs.Body>
        <Tabs.Section isActive={activeTab === "PURCHASE"}>
          <Section>
            <VehiclePurchaseForm />
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "INFORMATION"}>
          <Section>
            <Section.Group>
              <Section.Header title="Informações do veículo" />
              <Section.Body>
                <NewVehicleForm />
              </Section.Body>
            </Section.Group>
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "CHARACTERISTICS"}>
          <Section>
            <Section.Group>
              <Section.Header title="Selecione características" />
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
      </Tabs.Body>
    </Tabs>
  );
}
