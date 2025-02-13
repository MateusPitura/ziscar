import { createContext } from "react";
import { Dialog, Childrenable } from "../types";

const DialogContext = createContext<Dialog | null>(null);

interface DialogProviderProps extends Dialog, Childrenable {}

function DialogProvider({ children, ...dialog }: DialogProviderProps) {
  return (
    <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
  );
}

export { DialogContext, DialogProvider };
