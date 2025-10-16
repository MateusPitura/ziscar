import Spinner from "@/design-system/Spinner";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import { useIsFetching } from "@tanstack/react-query";
import type { ReactNode } from "react";
import AccountsReceivableInstallmentsHeader from "./AccountsReceivableInstallmentsHeader";
import AccountsReceivableInstallmentsTable from "./AccountsReceivableInstallmentsTable";

export default function AccountsReceivableInstallmentsPage({
  contextHelper,
}: ContextHelperable): ReactNode {
  const isFetching = useIsFetching({
    queryKey: ["account-receivable"],
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
      <AccountsReceivableInstallmentsHeader contextHelper={contextHelper} />
      <AccountsReceivableInstallmentsTable />
    </div>
  );
}
