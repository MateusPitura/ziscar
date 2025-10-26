import Spinner from "@/design-system/Spinner";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { FetchAccountPayable } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import selectAccountPayableInfo from "../utils/selectAccountPayableInfo";
import AccountsPayableInstallmentsHeader from "./AccountsPayableInstallmentsHeader";
import AccountsPayableInstallmentsTable from "./AccountsPayableInstallmentsTable";

export default function AccountsPayableInstallmentsPage({
  contextHelper,
}: ContextHelperable): ReactNode {
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

  const { data, isFetching } = useQuery({
    queryKey: ["account-payable", accountPayableId],
    queryFn: getAccountPayableInfo,
    select: selectAccountPayableInfo,
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
      <AccountsPayableInstallmentsHeader
        contextHelper={contextHelper}
        description={data?.description}
      />
      <AccountsPayableInstallmentsTable />
    </div>
  );
}
