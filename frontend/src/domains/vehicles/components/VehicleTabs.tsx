import Tabs from "@/design-system/Tabs";
import Section from "@/domains/global/components/Section";
import UpfrontForm from "@/domains/global/forms/UpfrontForm";
import VehicleCommonCharacteristicForm from "@/domains/vehicles/forms/VehicleCommonCharacteristicForm";
import VehicleNewCharacteristicForm from "@/domains/vehicles/forms/VehicleNewCharacteristicForm";
import { useState, type ReactNode } from "react";
import { useFormState } from "react-hook-form";
import PaymentForm from "../../global/forms/PaymentForm";
import VehicleForm from "../forms/VehicleForm";
import VehiclePurchaseDetailsForm from "../forms/VehiclePurchaseDetailsForm";
import { VehicleFormInputs } from "../types";

type VehicleTabs = "PURCHASE" | "INFORMATION" | "CHARACTERISTICS";

interface VehicleTabsProperties {
  isEdit?: boolean;
  purchaseValue?: string;
}

export default function VehicleTabs({
  isEdit,
  purchaseValue,
}: VehicleTabsProperties): ReactNode {
  const [activeTab, setActiveTab] = useState<VehicleTabs>("PURCHASE");
  const { errors } = useFormState<VehicleFormInputs>();

  return (
    <Tabs>
      <Tabs.Header>
        <Tabs.Tab
          isActive={activeTab === "PURCHASE"}
          title="Compra"
          onClick={() => setActiveTab("PURCHASE")}
          hasError={!!errors?.payment}
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
            <Section.Group>
              <Section.Header title="Informações da compra" />
              <Section.Body>
                <VehiclePurchaseDetailsForm value={purchaseValue} />
              </Section.Body>
            </Section.Group>
            {!isEdit && (
              <>
                <Section.Group>
                  <Section.Header title="Informações da entrada" />
                  <Section.Body>
                    <UpfrontForm />
                  </Section.Body>
                </Section.Group>
                <Section.Group>
                  <Section.Header title="Informações do pagamento" />
                  <Section.Body>
                    <PaymentForm />
                  </Section.Body>
                </Section.Group>
              </>
            )}
          </Section>
        </Tabs.Section>
        <Tabs.Section isActive={activeTab === "INFORMATION"}>
          <Section>
            <Section.Group>
              <Section.Header title="Informações do veículo" />
              <Section.Body className="grid-cols-3">
                <VehicleForm />
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
