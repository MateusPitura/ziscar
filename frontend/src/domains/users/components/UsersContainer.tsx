import PageHeader from "@/domains/global/components/PageHeader";
import type { ReactElement } from "react";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useNavigate } from "react-router-dom";
import DashBoard from "./DashBoard";
import { useQuery } from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { baseUrl } from "@/domains/global/constants/requests";
import { DashBoard as DashBoardProps } from "@/domains/global/types/DashBoard";
import Table from "@/design-system/Table";
import { User } from "@/domains/global/types/User";

export default function UsersContainer(): ReactElement {
  const navigate = useNavigate();

  const { safeFetch } = useSafeFetch();

  async function getDashBoardInfo(): Promise<DashBoardProps[]> {
    return await safeFetch({ path: `${baseUrl}/dashboard` });
  }

  const { data: dashBoardInfo, isFetching: isFetchingDatashBoardInfo } =
    useQuery({
      queryKey: ["user-dashboard"],
      queryFn: getDashBoardInfo,
    });

  async function getUsersInfo(): Promise<User[]> {
    return await safeFetch({ path: `${baseUrl}/users` });
  }

  const { data: usersInfo, isFetching: isFetchingUsersInfo } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersInfo,
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      <PageHeader
        title="Usuários"
        primaryButtonLabel="Adicionar usuário"
        onClickPrimaryBtn={() => navigate("/users/new")}
        primaryBtnIconRigth={<PersonAddOutlinedIcon />}
      />
      <DashBoard isLoading={isFetchingDatashBoardInfo}>
        {dashBoardInfo?.map((item) => (
          <DashBoard.Card key={item.id} label={item.label} value={item.value} />
        ))}
      </DashBoard>
      <Table>
        <Table.Header>
          <Table.Head label="ID" />
          <Table.Head label="Nome" />
          <Table.Head label="Email" />
          <Table.Head label="Celular" />
          <Table.Head label="Status" />
          <Table.Head label="Categoria" />
        </Table.Header>
        <Table.Body>
          {usersInfo?.map((user) => (
            <Table.Row>
              <Table.Cell label={user.id} />
              <Table.Cell label={user.fullName} />
              <Table.Cell label={user.email} />
              <Table.Cell label={user.cellphone} />
              <Table.Cell label={user.isActive ? "Ativo" : "Inativo"} />
              <Table.Cell label={user.category} />
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer />
      </Table>
    </div>
  );
}
