import Button from "@/design-system/Button";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { CustomersPageProvider } from "../contexts/CustomersPageContext";
import CustomersTable from "./CustomersTable";


export default function CustomersPage({ contextHelper }: ContextHelperable) {

  const navigate = useNavigate();

  return (
    <CustomersPageProvider>
      <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Clientes" contextHelper={contextHelper}>
        <Button
          label="Adicionar cliente"
          iconLeft="Add"
          onClick={() => navigate("/customers/new")}
          resource="CUSTOMERS"
          action="CREATE"
          color="green"
          data-cy="new-customer-button"
          tooltipMessage="Adicionar cliente"
        />
      </PageHeader>
      <CustomersTable />
    </div>
    </CustomersPageProvider>
  );
}
