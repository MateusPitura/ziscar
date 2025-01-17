import { createContext, ReactNode, useMemo, useState } from "react";
import { UserLogged } from "../types/User";
import { ClientLogged } from "../types/Client";

interface GlobalContextValues {
  userLogged?: UserLogged;
  clientLogged?: ClientLogged;
}

const GlobalContext = createContext<GlobalContextValues>({
  userLogged: undefined,
  clientLogged: undefined,
});

interface GlobalProviderProps {
  children: ReactNode;
}

function GlobalProvider({ children }: GlobalProviderProps) {
  const [userLogged] = useState<UserLogged | undefined>({
    id: "1",
  });

  const [clientLogged] = useState<ClientLogged | undefined>({
    id: "2",
  });

  const valuesMemoized = useMemo(
    () => ({
      userLogged,
      clientLogged,
    }),
    [userLogged, clientLogged]
  );

  return (
    <GlobalContext.Provider value={valuesMemoized}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
