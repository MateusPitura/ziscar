import { createContext, ReactNode, useMemo, useState } from "react";

interface VehiclesPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const VehiclesPageContext = createContext<VehiclesPageContextValues | null>(null);

interface VehiclesPageProviderProps {
  children: ReactNode;
}

function VehiclesPageProvider({ children }: VehiclesPageProviderProps) {
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
