import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import CustomersTable from "./CustomersTable";

export default function CustomersContainer(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Clientes">
        <Button
          label="Adicionar cliente"
          iconLeft="Add"
          onClick={() => navigate("/customers/new")}
          resource="CUSTOMERS"
          action="CREATE"
          color="green"
          data-cy="new-customer-button"
        />
      </PageHeader>
      <CustomersTable />
    </div>
  );
}
