import Spinner from "@/design-system/Spinner";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { FetchAccountReceivable } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import selectAccountReceivableInfo from "../utils/selectAccountReceivableInfo";
import AccountsReceivableInstallmentsHeader from "./AccountsReceivableInstallmentsHeader";
import AccountsReceivableInstallmentsTable from "./AccountsReceivableInstallmentsTable";

export default function AccountsReceivableInstallmentsPage({
  contextHelper,
}: ContextHelperable): ReactNode {
  const { accountReceivableId } = useParams();
  const { safeFetch } = useSafeFetch();

  async function getAccountReceivableInfo(): Promise<FetchAccountReceivable> {
    return await safeFetch(
      `${BACKEND_URL}/account-receivable/${accountReceivableId}`,
      {
        resource: "ACCOUNTS_RECEIVABLE",
        action: "READ",
      }
    );
  }

  const { data, isFetching } = useQuery({
    queryKey: ["account-receivable", accountReceivableId],
    queryFn: getAccountReceivableInfo,
    select: selectAccountReceivableInfo,
  });

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <AccountsReceivableInstallmentsHeader
        contextHelper={contextHelper}
        description={data?.description}
      />
      <AccountsReceivableInstallmentsTable />
    </div>
  );
}
