import Button from "@/design-system/Button";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AccountsReceivableInstallmentsHeaderProps extends ContextHelperable {
  description?: string;
}

export default function AccountsReceivableInstallmentsHeader({
  contextHelper,
  description,
}: AccountsReceivableInstallmentsHeaderProps): ReactNode {
  const navigate = useNavigate();

  return (
    <PageHeader
      title={
        description
          ? `Detalhes do Pagamento "${description}"`
          : "Detalhes do Pagamento"
      }
      contextHelper={contextHelper}
    >
      <Button
        variant="quaternary"
        label="Voltar"
        iconLeft="ArrowBack"
        onClick={() => navigate("/accounts-receivable")}
        action="READ"
        resource="ACCOUNTS_RECEIVABLE"
        data-cy="back-accounts-receivable-button"
        tooltipMessage="Página anterior"
      />
    </PageHeader>
  );
}
