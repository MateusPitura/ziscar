import Button from "@/design-system/Button";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { VehiclesPageProvider } from "../contexts/VehiclesPageContext";
import VehiclesTable from "./VehiclesTable";

export default function VehiclesPage({ contextHelper }: ContextHelperable) {
  const navigate = useNavigate();

  return (
    <VehiclesPageProvider>
      <div className="flex flex-col gap-4 h-full w-full">
        <PageHeader title="Veículos" contextHelper={contextHelper}>
          <Button
            label="Adicionar veículo"
            iconLeft="Add"
            onClick={() => navigate("/vehicles/new")}
            resource="VEHICLES"
            action="CREATE"
            color="green"
            data-cy="new-vehicle-button"
            tooltipMessage="Adicionar novo veículo"
          />
        </PageHeader>
        <VehiclesTable />
      </div>
    </VehiclesPageProvider>
  );
}
