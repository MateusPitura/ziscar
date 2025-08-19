import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactNode } from "react";
import AccountsReceivableInstallmentsTable from "./AccountsReceivableInstallmentsTable";
import Button from "@/design-system/Button";
import { useNavigate } from "react-router-dom";

export default function AccountsReceivableInstallmentsContainer(): ReactNode {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Detalhes da Conta a Receber">
        <Button
          variant="quaternary"
          label="Voltar"
          iconLeft="ArrowBack"
          onClick={() => navigate("/accounts-receivable")}
          action="READ"
          resource="ACCOUNTS_RECEIVABLE"
          data-cy="back-accounts-receivable-button"
        />
      </PageHeader>
      <AccountsReceivableInstallmentsTable />
    </div>
  );
}
