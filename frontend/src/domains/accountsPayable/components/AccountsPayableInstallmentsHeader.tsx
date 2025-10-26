import Button from "@/design-system/Button";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AccountsPayableInstallmentsHeaderProps extends ContextHelperable {
  description?: string;
}

export default function AccountsPayableInstallmentsHeader({
  contextHelper,
  description,
}: AccountsPayableInstallmentsHeaderProps): ReactNode {
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
        tooltipMessage="Página anterior"
        iconLeft="ArrowBack"
        onClick={() => navigate("/accounts-payable")}
        action="READ"
        resource="ACCOUNTS_PAYABLE"
        data-cy="back-accounts-payable-button"
      />
    </PageHeader>
  );
}
