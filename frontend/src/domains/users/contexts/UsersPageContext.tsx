import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";

interface UsersPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const UsersPageContext = createContext<UsersPageContextValues | null>(null);

function UsersPageProvider({ children }: Childrenable) {
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
    <UsersPageContext.Provider value={valuesMemoized}>
      {children}
    </UsersPageContext.Provider>
  );
}

export { UsersPageContext, UsersPageProvider };
