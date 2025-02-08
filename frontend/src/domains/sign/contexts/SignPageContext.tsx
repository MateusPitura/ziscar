import { Childrenable } from "@/domains/global/types/components";
import { createContext, useMemo, useState, ReactNode } from "react";

interface SignPageContextValues {
  example: boolean;
  handleExample: (value: boolean) => void;
}

const SignPageContext = createContext<SignPageContextValues | null>(null);

function SignPageProvider({ children }: Childrenable): ReactNode {
  const [example, setExample] = useState<boolean>(false);

  function handleExample(value: boolean) {
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
    <SignPageContext.Provider value={valuesMemoized}>
      {children}
    </SignPageContext.Provider>
  );
}

export { SignPageContext, SignPageProvider };
