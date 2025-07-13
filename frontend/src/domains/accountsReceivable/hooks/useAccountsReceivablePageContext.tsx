import { useContext } from "react";
import { AccountsReceivablePageContext } from "../contexts/AccountsReceivablePageContext";

export default function useAccountsReceivablePageContext() {
  const context = useContext(AccountsReceivablePageContext);

  if (!context) {
    throw new Error(
      "useAccountsReceivablePageContext must be used within a AccountsReceivablePageProvider"
    );
  }

  return context;
}
