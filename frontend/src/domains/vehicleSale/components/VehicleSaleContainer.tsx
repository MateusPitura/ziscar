import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { vehicleSaleDefaultValues } from "../constants";
import { SchemaVehicleSaleForm } from "../schemas";
import { VehicleSaleFormInputs } from "../types";
import VehicleSaleTabs from "./VehicleSaleTabs";

export default function VehicleSaleContainer(): ReactElement {
  const navigate = useNavigate();
  const { vehicleId } = useParams()

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<VehicleSaleFormInputs>
        onSubmit={(data) => {
          console.log(data);
        }}
        className="flex-1 flex flex-col gap-4"
        schema={SchemaVehicleSaleForm}
        defaultValues={{
          ...vehicleSaleDefaultValues,
          vehicle: { id: vehicleId ?? "" },
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
            onClick={() => navigate("/vehicles")}
          />
        </PageFooter>
      </Form>
    </div>
  );
}
