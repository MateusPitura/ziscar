import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import { AccountsPayablePageProvider } from "../contexts/AccountsPayablePageContext";
import AccountsPayableTable from "./AccountsPayableTable";

export default function AccountsPayablePage({
  contextHelper,
}: ContextHelperable) {
  return (
    <AccountsPayablePageProvider>
      <div className="flex flex-col gap-4 h-full w-full">
        <PageHeader title="Pagamentos" contextHelper={contextHelper} />
        <AccountsPayableTable />
      </div>
    </AccountsPayablePageProvider>
  );
}
