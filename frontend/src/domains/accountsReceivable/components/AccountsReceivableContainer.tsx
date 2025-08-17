import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactElement } from "react";
import AccountsReceivableTable from "./AccountsReceivableTable";

export default function AccountsReceivableContainer(): ReactElement {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Contas a Receber"/>
      <AccountsReceivableTable />
    </div>
  );
}
