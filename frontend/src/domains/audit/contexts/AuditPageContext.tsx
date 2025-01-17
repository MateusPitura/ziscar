import { createContext, ReactNode, useMemo, useState } from "react";

interface AuditPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const AuditPageContext = createContext<AuditPageContextValues | null>(null);

interface AuditPageProviderProps {
  children: ReactNode;
}

function AuditPageProvider({ children }: AuditPageProviderProps) {
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
    <AuditPageContext.Provider value={valuesMemoized}>
      {children}
    </AuditPageContext.Provider>
  );
}

export { AuditPageContext, AuditPageProvider };
