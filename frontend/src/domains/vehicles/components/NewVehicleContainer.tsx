import Form from "@/design-system/Form";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { NewVehicleFormInputs } from "../types";
import { SchemaNewVehicleForm } from "../schemas";
import PageHeader from "@/domains/global/components/PageHeader";
import PageFooter from "@/domains/global/components/PageFooter";
import Button from "@/design-system/Button";
import { PREVIOUS_PAGE } from "@/domains/global/constants";
import NewVehicleTabs from "./NewVehicleTabs";
import {
  FuelType,
  InstallmentStatus,
  PaymentMethodPayableType,
  VehicleCategory,
  VehicleStatus,
} from "@shared/enums";

export default function NewVehicleContainer(): ReactNode {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<NewVehicleFormInputs>
        onSubmit={(data) => {
          console.log("data: ", data);
        }}
        className="flex-1 flex flex-col gap-4"
        schema={SchemaNewVehicleForm}
        defaultValues={{
          characteristics: {
            commonCharacteristics: [],
            newCharacteristics: [],
          },
          purchase: {
            paidTo: "",
            purchaseDate: "",
            installment: {
              dueDate: "",
              value: "0",
              status: InstallmentStatus.PENDING,
              paymentDate: "",
              paymentMethod: PaymentMethodPayableType.CREDIT_CARD,
            },
          },
          vehicle: {
            kilometers: "0",
            plateNumber: "",
            announcedPrice: "0",
            minimumPrice: "0",
            commissionValue: "0",
            color: "",
            fuelType: FuelType.FLEX,
            status: VehicleStatus.PURCHASED,
            chassiNumber: "",
            modelYear: "",
            yearOfManufacture: "",
            modelName: "",
            category: VehicleCategory.CAR,
            storeId: "",
            brandId: "",
          },
        }}
      >
        <PageHeader title="Cadastrar veículo" />
        <NewVehicleTabs />
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
