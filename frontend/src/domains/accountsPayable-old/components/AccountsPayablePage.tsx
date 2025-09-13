import { AccountsPayablePageProvider } from "../contexts/AccountsPayablePageContext";
import AccountsPayableContainer from "./AccountsPayableContainer";

export default function AccountsPayablePage() {
  return (
    <AccountsPayablePageProvider>
      <AccountsPayableContainer />
    </AccountsPayablePageProvider>
  );
}
