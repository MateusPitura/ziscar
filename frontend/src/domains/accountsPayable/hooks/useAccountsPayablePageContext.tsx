import { useContext } from "react";
import { AccountsPayablePageContext } from "../contexts/AccountsPayablePageContext";

export default function useAccountsPayablePageContext() {
  const context = useContext(AccountsPayablePageContext);

  if (!context) {
    throw new Error(
      "useAccountsPayablePageContext must be used within a AccountsPayablePageProvider"
    );
  }

  return context;
}
