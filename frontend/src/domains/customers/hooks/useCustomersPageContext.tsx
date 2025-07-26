import { useContext } from "react";
import { CustomersPageContext } from "../contexts/CustomersPageContext";

export default function useCustomersPageContext() {
  const context = useContext(CustomersPageContext);

  if (!context) {
    throw new Error(
      "useCustomersPageContext must be used within a CustomersPageProvider"
    );
  }

  return context;
}
