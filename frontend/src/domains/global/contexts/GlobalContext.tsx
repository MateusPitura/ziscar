import { createContext, useMemo } from "react";
import { Childrenable } from "../types";
import { AUTH_CHANNEL, DEFAULT_ROUTE } from "../constants";
import safeNavigate from "../utils/safeNavigate";

interface GlobalContextValues {
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

  const valuesMemoized = useMemo(
    () => ({
      authChannel,
    }),
    []
  );

  return (
    <GlobalContext.Provider value={valuesMemoized}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
