import { AuditPageProvider } from "../contexts/AuditPageContext";
import AuditContainer from "./AuditContainer";

export default function AuditPage() {
  return (
    <AuditPageProvider>
      <AuditContainer />
    </AuditPageProvider>
  );
}
