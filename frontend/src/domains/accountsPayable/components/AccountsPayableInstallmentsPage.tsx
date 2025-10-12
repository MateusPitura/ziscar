import Spinner from "@/design-system/Spinner";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import { useIsFetching } from "@tanstack/react-query";
import type { ReactNode } from "react";
import AccountsPayableInstallmentsHeader from "./AccountsPayableInstallmentsHeader";
import AccountsPayableInstallmentsTable from "./AccountsPayableInstallmentsTable";

export default function AccountsPayableInstallmentsPage({ contextHelper}: ContextHelperable): ReactNode {
  const isFetching = useIsFetching({
    queryKey: ["account-payable"],
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
      <AccountsPayableInstallmentsHeader contextHelper={contextHelper}/>
      <AccountsPayableInstallmentsTable />
    </div>
  );
}
