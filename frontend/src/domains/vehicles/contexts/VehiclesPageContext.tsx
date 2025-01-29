import { Childrenable } from "@/domains/global/types/components";
import { createContext, useMemo, useState } from "react";

interface VehiclesPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const VehiclesPageContext = createContext<VehiclesPageContextValues | null>(null);

function VehiclesPageProvider({ children }: Childrenable ) {
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
    <VehiclesPageContext.Provider value={valuesMemoized}>
      {children}
    </VehiclesPageContext.Provider>
  );
}

export { VehiclesPageContext, VehiclesPageProvider };
