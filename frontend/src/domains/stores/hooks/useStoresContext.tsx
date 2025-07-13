import { useContext } from "react";
import { StoresPageContext } from "../contexts/StoresPageContext";

export default function useStoresPageContext() {
  const context = useContext(StoresPageContext);

  if (!context) {
    throw new Error(
      "useStoresPageContext must be used within a StoresPageProvider"
    );
  }

  return context;
}
