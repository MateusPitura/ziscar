import { createContext, ReactNode, useMemo, useState } from "react";

interface ProfilePageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const ProfilePageContext = createContext<ProfilePageContextValues>({
  example: "",
  handleExample: () => {},
});

interface ProfilePageProviderProps {
  children: ReactNode;
}

function ProfilePageProvider({ children }: ProfilePageProviderProps) {
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
