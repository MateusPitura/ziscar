import { Childrenable } from "@/domains/global/types/components";
import { createContext, useMemo, useState } from "react";

interface AuditPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const AuditPageContext = createContext<AuditPageContextValues | null>(null);

function AuditPageProvider({ children }: Childrenable) {
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
