import { createContext } from "react";
import { Childrenable, Dialog } from "../types/components";

const DialogContext = createContext<Dialog | null>(null);

interface DialogProviderProps extends Dialog, Childrenable {}

function DialogProvider({ children, ...dialog }: DialogProviderProps) {
  return (
    <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
  );
}

export { DialogContext, DialogProvider };
