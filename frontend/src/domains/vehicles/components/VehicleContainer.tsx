import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import VehiclesTable from "./VehiclesTable";

export default function VehicleContainer(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Veículos">
        <Button
          label="Adicionar veículo"
          iconLeft="Add"
          onClick={() => navigate("/vehicles/new")}
          resource="VEHICLES"
          action="CREATE"
          color="green"
          data-cy="new-vehicle-button"
        />
      </PageHeader>
      <VehiclesTable />
    </div>
  );
}
