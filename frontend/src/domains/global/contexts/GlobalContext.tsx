import { createContext, useCallback, useMemo, useState } from "react";
import { userFilterDefaultValues } from "@/domains/users/constants";
import { Childrenable, StoresFilter, UsersFilter } from "../types";
import { AUTH_CHANNEL, DEFAULT_ROUTE } from "../constants";
import safeNavigate from "../utils/safeNavigate";
import { storeFilterDefaultValues } from "@/domains/stores/constants";

interface GlobalContextValues {
  usersFilter?: UsersFilter;
  handleUsersFilter: (value: Partial<UsersFilter>) => void;
  storesFilter?: StoresFilter;
  handleStoresFilter: (value: Partial<StoresFilter>) => void;
  authChannel: BroadcastChannel;
}

const GlobalContext = createContext<GlobalContextValues | null>(null);
const authChannel = new BroadcastChannel("auth");

function GlobalProvider({ children }: Childrenable) {
  authChannel.onmessage = (event) => {
    if (event?.data?.type === AUTH_CHANNEL.SIGNIN) {
      safeNavigate(DEFAULT_ROUTE);
    } else if (event?.data?.type === AUTH_CHANNEL.SIGNOUT) {
      safeNavigate("/");
    }
  };

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

  const [storesFilter, setStoresFilter] = useState<StoresFilter>({
    page: 1,
    ...storeFilterDefaultValues,
  });

  const handleStoresFilter = useCallback((value: Partial<StoresFilter>) => {
    setStoresFilter((prev) => ({
      ...prev,
      ...value,
    }));
  }, []);

  const valuesMemoized = useMemo(
    () => ({
      usersFilter,
      handleUsersFilter,
      storesFilter,
      handleStoresFilter,
      authChannel,
    }),
    [usersFilter, handleUsersFilter, storesFilter, handleStoresFilter]
  );

  return (
    <GlobalContext.Provider value={valuesMemoized}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
