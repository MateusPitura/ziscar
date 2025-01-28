import { createContext, ReactNode, useMemo, useState } from "react";

interface CustomFormContextProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CustomFormContext = createContext<CustomFormContextProps | null>(null);

interface CustomFormProviderProps {
  children: ReactNode;
}

function CustomFormProvider({ children }: CustomFormProviderProps) {
  const [open, setOpen] = useState(false);

  const valuesMemoized = useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open]
  );

  return (
    <CustomFormContext.Provider value={valuesMemoized}>
      {children}
    </CustomFormContext.Provider>
  );
}

export { CustomFormContext, CustomFormProvider };
