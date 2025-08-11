import PageHeader from "@/domains/global/components/PageHeader";
import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import UsersTable from "./UsersTable";
import Button from "@/design-system/Button";

export default function UsersContainer(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <PageHeader title="Usuários">
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
  );
}
