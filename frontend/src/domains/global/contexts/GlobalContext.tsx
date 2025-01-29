import { createContext, useMemo, useState } from "react";
import { UserLogged } from "../types/user";
import { ClientLogged } from "../types/client";
import { Childrenable } from "../types/components";

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
