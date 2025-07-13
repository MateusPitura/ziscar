import { AccountsPayablePageProvider } from "../contexts/AccountsPayablePageContext";
import AccountsPayableContainer from "./AccountsPayable";

export default function AccountsPayablePage() {
  return (
    <AccountsPayablePageProvider>
      <AccountsPayableContainer />
    </AccountsPayablePageProvider>
  );
}
