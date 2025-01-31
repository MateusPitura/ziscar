import { createContext } from "react";
import { Childrenable } from "../types/components";
import { DialogProps } from "../types/dialog";

const DialogContext = createContext<DialogProps | null>(null);

interface DialogProviderProps extends DialogProps, Childrenable {}

function DialogProvider({ children, ...props }: DialogProviderProps) {
  return (
    <DialogContext.Provider value={props}>{children}</DialogContext.Provider>
  );
}

export { DialogContext, DialogProvider };
