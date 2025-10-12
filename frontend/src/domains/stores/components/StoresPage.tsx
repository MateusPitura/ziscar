import Button from "@/design-system/Button";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { StoresPageProvider } from "../contexts/StoresPageContext";
import StoresTable from "./StoresTable";

export default function StoresPage({ contextHelper}: ContextHelperable) {
  const navigate = useNavigate();

  return (
    <StoresPageProvider>
      <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Lojas" contextHelper={contextHelper}>
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
    </StoresPageProvider>
  );
}
