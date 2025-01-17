import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

export default function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
