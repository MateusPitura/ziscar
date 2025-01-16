import { createContext, ReactNode, useMemo, useState } from "react";
import { UserLogged } from "../types/User";

interface GlobalContextValues {
  userLogged?: UserLogged;
}

const GlobalContext = createContext<GlobalContextValues>({
  userLogged: undefined,
});

interface GlobalProviderProps {
  children: ReactNode;
}

function GlobalProvider({ children }: GlobalProviderProps) {
  const [userLogged] = useState<UserLogged | undefined>({
    id: "1",
  });

  const valuesMemoized = useMemo(
    () => ({
      userLogged,
    }),
    [userLogged]
  );

  return (
    <GlobalContext.Provider value={valuesMemoized}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
