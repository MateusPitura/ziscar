import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactNode } from "react";
import VehicleExpenseTable from "./VehicleExpenseTable";
import { useLocation, useNavigate } from "react-router-dom";

export default function VehicleExpenseContainer(): ReactNode {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Gastos do Veículo">
        <Button
          label="Voltar"
          iconLeft="ArrowBack"
          onClick={() => navigate("/vehicles")}
          resource="VEHICLE_EXPENSE"
          action="CREATE"
          variant="quaternary"
          data-cy="back-vehicle-expense-button"
        />
        <Button
          label="Adicionar gasto"
          iconLeft="Add"
          onClick={() => navigate(`${pathname}/new`)}
          resource="VEHICLE_EXPENSE"
          action="CREATE"
          color="green"
          data-cy="new-vehicle-expense-button"
        />
      </PageHeader>
      <VehicleExpenseTable />
    </div>
  );
}
