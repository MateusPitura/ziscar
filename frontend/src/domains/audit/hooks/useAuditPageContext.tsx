import { useContext } from "react";
import { AuditPageContext } from "../contexts/AuditPageContext";

export default function useAuditPageContext() {
  const context = useContext(AuditPageContext);

  if (!context) {
    throw new Error(
      "useAuditPageContext must be used within a AuditPageProvider"
    );
  }

  return context;
}
