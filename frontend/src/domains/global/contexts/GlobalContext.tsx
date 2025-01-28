import { createContext, useMemo, useState } from "react";
import { UserLogged } from "../types/User";
import { ClientLogged } from "../types/Client";
import { Childrenable } from "../types/Components";

interface GlobalContextValues {
  userLogged?: UserLogged;
  clientLogged?: ClientLogged;
}

const GlobalContext = createContext<GlobalContextValues | null>(null);

function GlobalProvider({ children }: Childrenable) {
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
