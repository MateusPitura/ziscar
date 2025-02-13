import { createContext } from "react";
import { DialogProps, Childrenable } from "../types";

const DialogContext = createContext<DialogProps | null>(null);

interface DialogProviderProps extends DialogProps, Childrenable {}

function DialogProvider({ children, ...dialog }: DialogProviderProps) {
  return (
    <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
  );
}

export { DialogContext, DialogProvider };
