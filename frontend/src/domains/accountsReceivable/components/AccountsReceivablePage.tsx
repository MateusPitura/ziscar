import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import { AccountsReceivablePageProvider } from "../contexts/AccountsReceivablePageContext";
import AccountsReceivableTable from "./AccountsReceivableTable";

export default function AccountsReceivablePage({
  contextHelper,
}: ContextHelperable) {
  return (
    <AccountsReceivablePageProvider>
      <div className="flex flex-col gap-4 h-full w-full">
        <PageHeader title="Vendas" contextHelper={contextHelper} />
        <AccountsReceivableTable />
      </div>
    </AccountsReceivablePageProvider>
  );
}
