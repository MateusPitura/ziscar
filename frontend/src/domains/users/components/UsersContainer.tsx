import PageHeader from "@/domains/global/components/PageHeader";
import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import UsersDashBoard from "./UsersDashBoard";
import UsersTable from "./UsersTable";
import Icon from "@/design-system/Icon";

export default function UsersContainer(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full">
      <PageHeader
        title="Usuários"
        primaryButtonLabel="Adicionar usuário"
        onClickPrimaryBtn={() => navigate("/users/new")}
        primaryBtnIconRigth={<Icon iconName="PersonAdd" />}
        primaryBtnResource="USERS"
        primaryBtnAction="CREATE"
      />
      <UsersDashBoard />
      <UsersTable />
    </div>
  );
}
