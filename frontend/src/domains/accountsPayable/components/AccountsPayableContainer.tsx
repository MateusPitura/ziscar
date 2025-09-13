import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactElement } from "react";
import AccountsPayableTable from "./AccountsPayableTable";

export default function AccountsPayableContainer(): ReactElement {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Pagamentos"/>
      <AccountsPayableTable />
    </div>
  );
}
