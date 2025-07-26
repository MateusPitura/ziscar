import Button from "@/design-system/Button";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { PREVIOUS_PAGE } from "@/domains/global/constants";
import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import VehicleSaleTabs from "./VehicleSaleTabs";
import Form from "@/design-system/Form";
import { SchemaVehicleSaleForm } from "../schemas";
import { VehicleSaleFormInputs } from "../types";
import { applyMask } from "@/domains/global/utils/applyMask";

export default function VehicleSaleContainer(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<VehicleSaleFormInputs>
        onSubmit={(data) => {
          const { commonCharacteristics, ...rest } = data.vehicle;

          const formattedCharacteristics = commonCharacteristics.map(
            (item) => ({
              label: item,
              value: "Sim",
            })
          );

          const payload = {
            ...data,
            vehicle: {
              ...rest,
              characteristics: [
                ...data.vehicle.characteristics,
                ...formattedCharacteristics,
              ],
            },
          };

          return payload
        }}
        className="flex-1 flex flex-col gap-4"
        schema={SchemaVehicleSaleForm}
        defaultValues={{
          customer: { id: "", fullName: "Mateus", email: "mateus@email.com" },
          vehicle: {
            model: "Ford",
            price: applyMask("10000", "money"),
            color: "#FFFFFF",
            commonCharacteristics: [],
            characteristics: [],
          },
          payment: { isUpfront: true, installments: 1 },
        }}
      >
        <PageHeader title="Realizar venda" />
        <VehicleSaleTabs />
        <PageFooter dirty>
          <Button color="lightBlue" iconRight="Save" label="Salvar" />
          <Button
            color="red"
            iconRight="Close"
            label="Cancelar"
            onClick={() => navigate(PREVIOUS_PAGE)}
          />
        </PageFooter>
      </Form>
    </div>
  );
}
