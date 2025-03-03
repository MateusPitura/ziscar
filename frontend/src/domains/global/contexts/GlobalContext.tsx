import { createContext, useCallback, useMemo, useState } from "react";
import { userFilterDefaultValues } from "@/domains/users/constants";
import { Childrenable, UsersFilter } from "../types";
import { ClientLogged, UserLogged } from "../types/model";

interface GlobalContextValues {
  userLogged?: UserLogged;
  clientLogged?: ClientLogged;
  usersFilter?: UsersFilter;
  handleUsersFilter: (value: Partial<UsersFilter>) => void;
}

const GlobalContext = createContext<GlobalContextValues | null>(null);

function GlobalProvider({ children }: Childrenable) {
  const [userLogged] = useState<UserLogged | undefined>({
    id: "1",
    permissions: {
      users: {
        read: true,
        create: true,
        update: true,
        delete: true,
      },
    },
  });

  const [clientLogged] = useState<ClientLogged | undefined>({
    id: "2",
  });

  const [usersFilter, setUsersFilter] = useState<UsersFilter>({
    page: 1,
    ...userFilterDefaultValues,
  });

  const handleUsersFilter = useCallback((value: Partial<UsersFilter>) => {
    setUsersFilter((prev) => ({
      ...prev,
      ...value,
    }));
  }, []);

  const valuesMemoized = useMemo(
    () => ({
      userLogged,
      clientLogged,
      usersFilter,
      handleUsersFilter,
    }),
    [userLogged, clientLogged, usersFilter]
  );

  return (
    <GlobalContext.Provider value={valuesMemoized}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
