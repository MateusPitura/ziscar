import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { FetchAccountPayable } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import selectAccountPayableInfo from "../utils/selectAccountPayableInfo";
import { ContextHelperable } from "@/domains/contextHelpers/types";

export default function AccountsPayableInstallmentsHeader({ contextHelper}: ContextHelperable): ReactNode {
  const navigate = useNavigate();
  const { accountPayableId } = useParams();
  const { safeFetch } = useSafeFetch();

  async function getAccountPayableInfo(): Promise<FetchAccountPayable> {
    return await safeFetch(
      `${BACKEND_URL}/account-payable/${accountPayableId}`,
      {
        resource: "ACCOUNTS_PAYABLE",
        action: "READ",
      }
    );
  }

  const { data } = useQuery({
    queryKey: ["account-payable", accountPayableId],
    queryFn: getAccountPayableInfo,
    select: selectAccountPayableInfo,
  });

  return (
    <PageHeader
      title={
        data?.description
          ? `Detalhes do Pagamento "${data.description}"`
          : "Detalhes do Pagamento"
      }
      contextHelper={contextHelper}
    >
      <Button
        variant="quaternary"
        label="Voltar"
        iconLeft="ArrowBack"
        onClick={() => navigate("/accounts-payable")}
        action="READ"
        resource="ACCOUNTS_PAYABLE"
        data-cy="back-accounts-payable-button"
      />
    </PageHeader>
  );
}
