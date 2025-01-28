import { Childrenable } from "@/domains/global/types/Components";
import { createContext, useMemo, useState } from "react";

interface ProfilePageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const ProfilePageContext = createContext<ProfilePageContextValues | null>(null);

function ProfilePageProvider({ children }: Childrenable) {
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
    <ProfilePageContext.Provider value={valuesMemoized}>
      {children}
    </ProfilePageContext.Provider>
  );
}

export { ProfilePageContext, ProfilePageProvider };
