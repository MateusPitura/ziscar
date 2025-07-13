import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";

interface StoresPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const StoresPageContext = createContext<StoresPageContextValues | null>(
  null
);

function StoresPageProvider({ children }: Childrenable) {
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
    <StoresPageContext.Provider value={valuesMemoized}>
      {children}
    </StoresPageContext.Provider>
  );
}

export { StoresPageContext, StoresPageProvider };
