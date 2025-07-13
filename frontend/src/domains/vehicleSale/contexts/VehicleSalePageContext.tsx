import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";

interface VehicleSalePageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const VehicleSalePageContext =
  createContext<VehicleSalePageContextValues | null>(null);

function VehicleSalePageProvider({ children }: Childrenable) {
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
    <VehicleSalePageContext.Provider value={valuesMemoized}>
      {children}
    </VehicleSalePageContext.Provider>
  );
}

export { VehicleSalePageContext, VehicleSalePageProvider };
