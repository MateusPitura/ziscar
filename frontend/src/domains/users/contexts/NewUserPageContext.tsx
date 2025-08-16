import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";

interface NewUserPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const NewUserPageContext = createContext<NewUserPageContextValues | null>(
  null
);

function NewUserPageProvider({ children }: Childrenable) {
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
    <NewUserPageContext.Provider value={valuesMemoized}>
      {children}
    </NewUserPageContext.Provider>
  );
}

export { NewUserPageContext, NewUserPageProvider };
