import { AuditPageProvider } from "../contexts/AuditPageContext";

export default function AuditPage() {
  return (
    <AuditPageProvider>
      <AuditPage />
    </AuditPageProvider>
  );
}
