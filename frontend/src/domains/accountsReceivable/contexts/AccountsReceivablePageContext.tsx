import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";

interface AccountsReceivablePageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const AccountsReceivablePageContext =
  createContext<AccountsReceivablePageContextValues | null>(null);

function AccountsReceivablePageProvider({ children }: Childrenable) {
  const [example, setExample] = useState("");

  function handleExample(value: string) {
    setExample(value);
  }

  const valuesMemoized = useMemo(
    () => ({
      example,
      handleExample,
    }),
    [example]
  );

  return (
    <AccountsReceivablePageContext.Provider value={valuesMemoized}>
      {children}
    </AccountsReceivablePageContext.Provider>
  );
}

export { AccountsReceivablePageContext, AccountsReceivablePageProvider };
