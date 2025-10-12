import Button from "@/design-system/Button";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageHeader from "@/domains/global/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { UsersPageProvider } from "../contexts/UsersPageContext";
import UsersTable from "./UsersTable";

export default function UsersPage({ contextHelper}: ContextHelperable) {
  const navigate = useNavigate();


  return (
    <UsersPageProvider>
      <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Usuários" contextHelper={contextHelper}>
        <Button
          label="Adicionar usuário"
          iconLeft="Add"
          onClick={() => navigate("/users/new")}
          resource="USERS"
          action="CREATE"
          color="green"
          data-cy="new-user-button"
        />
      </PageHeader>
      <UsersTable />
    </div>
    </UsersPageProvider>
  );
}
