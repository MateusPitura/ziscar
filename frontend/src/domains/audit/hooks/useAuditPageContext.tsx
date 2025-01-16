import { useContext } from "react";
import { AuditPageContext } from "../contexts/AuditPageContext";

export default function useAuditPageContext() {
  return useContext(AuditPageContext);
}
