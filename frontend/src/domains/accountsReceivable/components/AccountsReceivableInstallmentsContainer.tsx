import Spinner from "@/design-system/Spinner";
import type { ReactNode } from "react";
import AccountsReceivableInstallmentsHeader from "./AccountsReceivableInstallmentsHeader";
import AccountsReceivableInstallmentsTable from "./AccountsReceivableInstallmentsTable";
import { useIsFetching } from "@tanstack/react-query";

export default function AccountsReceivableInstallmentsContainer(): ReactNode {
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
      <AccountsReceivableInstallmentsHeader />
      <AccountsReceivableInstallmentsTable />
    </div>
  );
}
