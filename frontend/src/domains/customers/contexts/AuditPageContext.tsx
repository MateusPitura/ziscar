import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";

interface CustomersPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const CustomersPageContext = createContext<CustomersPageContextValues | null>(
  null
);

function CustomersPageProvider({ children }: Childrenable) {
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
    <CustomersPageContext.Provider value={valuesMemoized}>
      {children}
    </CustomersPageContext.Provider>
  );
}

export { CustomersPageContext, CustomersPageProvider };
