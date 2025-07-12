import { AccountsReceivablePageProvider } from "../contexts/AccountsReceivablePageContext";
import AccountsReceivableContainer from "./AccountsReceivableContainer";

export default function AccountsReceivablePage() {
  return (
    <AccountsReceivablePageProvider>
      <AccountsReceivableContainer />
    </AccountsReceivablePageProvider>
  );
}
