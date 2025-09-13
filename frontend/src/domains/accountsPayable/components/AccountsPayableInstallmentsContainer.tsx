import Spinner from "@/design-system/Spinner";
import { useIsFetching } from "@tanstack/react-query";
import type { ReactNode } from "react";
import AccountsPayableInstallmentsHeader from "./AccountsPayableInstallmentsHeader";
import AccountsPayableInstallmentsTable from "./AccountsPayableInstallmentsTable";

export default function AccountsPayableInstallmentsContainer(): ReactNode {
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
      <AccountsPayableInstallmentsHeader />
      <AccountsPayableInstallmentsTable />
    </div>
  );
}
