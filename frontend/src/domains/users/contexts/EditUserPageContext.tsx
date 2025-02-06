import { Childrenable } from "@/domains/global/types/components";
import { createContext, useMemo, useState, ReactNode } from "react";

interface EditUserPageContextValues {
  example: boolean;
  handleExample: (value: boolean) => void;
}

const EditUserPageContext = createContext<EditUserPageContextValues | null>(
  null
);

function EditUserPageContextProvider({ children }: Childrenable): ReactNode {
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
    <EditUserPageContext.Provider value={valuesMemoized}>
      {children}
    </EditUserPageContext.Provider>
  );
}

export { EditUserPageContext, EditUserPageContextProvider };
