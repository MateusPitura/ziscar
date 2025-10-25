import Button from "@/design-system/Button";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface VehicleExpenseHeaderProps extends ContextHelperable {
  title: string;
  showActions?: boolean;
  plateNumber?: string;
}

export default function VehicleExpenseHeader({
  title,
  showActions,
  contextHelper,
  plateNumber,
}: VehicleExpenseHeaderProps): ReactNode {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <PageHeader
      title={plateNumber ? `${title} "${plateNumber}"` : title}
      contextHelper={contextHelper}
    >
      {showActions && (
        <>
          <Button
            label="Voltar"
            iconLeft="ArrowBack"
            onClick={() => navigate("/vehicles")}
            resource="VEHICLES"
            action="READ"
            variant="quaternary"
            data-cy="back-vehicle-expense-button"
            tooltipMessage="Página anterior"
          />
          <Button
            label="Adicionar gasto"
            iconLeft="Add"
            onClick={() => navigate(`${pathname}/new`)}
            resource="VEHICLE_EXPENSE"
            action="CREATE"
            color="green"
            data-cy="new-vehicle-expense-button"
            tooltipMessage="Adicionar novo gasto"
          />
        </>
      )}
    </PageHeader>
  );
}
