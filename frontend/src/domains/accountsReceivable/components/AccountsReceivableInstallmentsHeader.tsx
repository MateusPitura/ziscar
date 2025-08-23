import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import { FetchAccountReceivable } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import selectAccountReceivableInfo from "../utils/selectAccountReceivableInfo";

export default function AccountsReceivableInstallmentsHeader(): ReactNode {
  const navigate = useNavigate();
  const { accountReceivableId } = useParams();

  async function getAccountReceivableInfo(): Promise<FetchAccountReceivable> {
    // return await safeFetch(`${BACKEND_URL}/account-receivable/${accountReceivableId}`, {
    //   resource: "ACCOUNTS_RECEIVABLE",
    //   action: "READ",
    // });
    return {
      id: 1,
      description: "Conta a receber 1",
      receivedFrom: "Cliente A",
      totalValue: "10000",
      overallStatus: "PENDING",
      installmentsNumber: 2,
      vehicleSaleId: 1,
    };
  }

  const { data } = useQuery({
    queryKey: ["account-receivable", accountReceivableId],
    queryFn: getAccountReceivableInfo,
    select: selectAccountReceivableInfo,
  });

  return (
    <PageHeader
      title={
        data?.description
          ? `Detalhes do Pagamento da Venda "${data.description}"`
          : "Detalhes do Pagamento da Venda"
      }
    >
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
  );
}
