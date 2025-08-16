import Button from "@/design-system/Button";
import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import StoresTable from "./StoresTable";

export default function StoresContainer(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Lojas">
        <Button
          label="Adicionar loja"
          iconLeft="Add"
          onClick={() => navigate("/stores/new")}
          resource="STORES"
          action="CREATE"
          color="green"
          data-cy="new-store-button"
        />
      </PageHeader>
      <StoresTable />
    </div>
  );
}
