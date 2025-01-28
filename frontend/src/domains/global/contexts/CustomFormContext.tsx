import { createContext, useMemo, useState } from "react";
import { Childrenable } from "../types/Components";

interface CustomFormContextProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CustomFormContext = createContext<CustomFormContextProps | null>(null);

function CustomFormProvider({ children }: Childrenable) {
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
