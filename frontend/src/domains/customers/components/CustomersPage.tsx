import { CustomersPageProvider } from "../contexts/CustomersPageContext";
import CustomersContainer from "./CustomersContainer";

export default function CustomersPage() {
  return (
    <CustomersPageProvider>
      <CustomersContainer />
    </CustomersPageProvider>
  );
}
