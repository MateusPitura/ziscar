import { createContext, useCallback, useMemo, useState } from "react";
import { UserLogged } from "../types/user";
import { ClientLogged } from "../types/client";
import { Childrenable } from "../types/components";
import { Pageable } from "../types/filters";
import { defaultValues } from "@/domains/users/constants/usersFilter";
import { UsersFilterFormInputs } from "@/domains/users/schemas/usersFilters";

interface UsersFilter extends UsersFilterFormInputs, Pageable {}

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
  });

  const [clientLogged] = useState<ClientLogged | undefined>({
    id: "2",
  });

  const [usersFilter, setUsersFilter] = useState<UsersFilter>(defaultValues);

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
