import { CustomersPageProvider } from "../contexts/AuditPageContext";
import CustomersContainer from "./CustomersContainer";

export default function CustomersPage() {
  return (
    <CustomersPageProvider>
      <CustomersContainer />
    </CustomersPageProvider>
  );
}
