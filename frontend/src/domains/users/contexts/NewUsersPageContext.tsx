import { Childrenable } from "@/domains/global/types/Components";
import { createContext, useMemo, useState } from "react";

interface NewUsersPageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const NewUsersPageContext = createContext<NewUsersPageContextValues | null>(
  null
);

function NewUsersPageProvider({ children }: Childrenable) {
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
    <NewUsersPageContext.Provider value={valuesMemoized}>
      {children}
    </NewUsersPageContext.Provider>
  );
}

export { NewUsersPageContext, NewUsersPageProvider };
