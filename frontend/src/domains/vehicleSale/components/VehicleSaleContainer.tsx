import Button from "@/design-system/Button";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { PREVIOUS_PAGE } from "@/domains/global/constants";
import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import VehicleSaleTabs from "./VehicleSaleTabs";
import Form from "@/design-system/Form";
import { SchemaVehicleSaleForm } from "../schemas";


export default function VehicleSaleContainer(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form
        onSubmit={(data) => {
          console.log("🌠 data: ", data);
        }}
        className="flex-1 flex flex-col gap-4"
        schema={SchemaVehicleSaleForm}
        defaultValues={{
          client: { fullName: "", cpf: "" },
          vehicle: { model: "", price: 0 },
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
