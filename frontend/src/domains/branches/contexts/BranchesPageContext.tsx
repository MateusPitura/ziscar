import { createContext, ReactNode, useMemo, useState } from "react";

interface BranchesPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const BranchesPageContext = createContext<BranchesPageContextValues>({
  example: "",
  handleExample: () => {},
});

interface BranchesPageProviderProps {
  children: ReactNode;
}

function BranchesPageProvider({ children }: BranchesPageProviderProps) {
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
