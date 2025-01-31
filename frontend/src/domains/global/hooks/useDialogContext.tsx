import { useContext } from "react";
import { DialogContext } from "../contexts/DialogContext";

export default function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
}
