import { createContext, ReactNode, useMemo, useState } from "react";

interface UsersPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const UsersPageContext = createContext<UsersPageContextValues>({
  example: "",
  handleExample: () => {},
});

interface UsersPageProviderProps {
  children: ReactNode;
}

function UsersPageProvider({ children }: UsersPageProviderProps) {
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
