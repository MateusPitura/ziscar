import { Childrenable } from "@/domains/global/types/components";
import { createContext, useMemo, useState } from "react";

interface BranchesPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const BranchesPageContext = createContext<BranchesPageContextValues | null>(
  null
);

function BranchesPageProvider({ children }: Childrenable) {
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
    <BranchesPageContext.Provider value={valuesMemoized}>
      {children}
    </BranchesPageContext.Provider>
  );
}

export { BranchesPageContext, BranchesPageProvider };
