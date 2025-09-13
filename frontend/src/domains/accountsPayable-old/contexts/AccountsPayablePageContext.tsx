import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";

interface AccountsPayablePageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const AccountsPayablePageContext =
  createContext<AccountsPayablePageContextValues | null>(null);

function AccountsPayablePageProvider({ children }: Childrenable) {
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
    <AccountsPayablePageContext.Provider value={valuesMemoized}>
      {children}
    </AccountsPayablePageContext.Provider>
  );
}

export { AccountsPayablePageContext, AccountsPayablePageProvider };
