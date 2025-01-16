import { createContext, ReactNode, useMemo, useState } from "react";

interface GlobalContextValues {
  isUserLogged: boolean;
  handleSetIsUserLogged: (value: boolean) => void;
}

const GlobalContext = createContext<GlobalContextValues>({
  isUserLogged: false,
  handleSetIsUserLogged: () => {},
});

interface GlobalProviderProps {
  children: ReactNode;
}

function GlobalProvider({ children }: GlobalProviderProps) {
  const [isUserLogged, setIsUserLogged] = useState(false);

  function handleSetIsUserLogged(value: boolean) {
    setIsUserLogged(value);
  }

  const valuesMemoized = useMemo(
    () => ({
      isUserLogged,
      handleSetIsUserLogged,
    }),
    [isUserLogged]
  );

  return (
    <GlobalContext.Provider value={valuesMemoized}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
