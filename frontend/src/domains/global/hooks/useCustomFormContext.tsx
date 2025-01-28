import { useContext } from "react";
import { CustomFormContext } from "../contexts/CustomFormContext";

export default function useCustomFormContext() {
  const context = useContext(CustomFormContext);
  if (!context) {
    throw new Error("useCustomFormContext must be used within a CustomFormProvider");
  }
  return context;
}
