import PageHeader from "@/domains/global/components/PageHeader";
import { useState, type ReactElement } from "react";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { useNavigate } from "react-router-dom";
import DashBoard from "./DashBoard";
import { useQuery } from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { baseUrl } from "@/domains/global/constants/requests";
import { DashBoard as DashBoardProps } from "@/domains/global/types/DashBoard";
import Table from "@/design-system/Table";
import { User } from "@/domains/global/types/User";
import selectUsersInfo from "../utils/selectUsersInfo";
import Button from "@/design-system/Button";
import DisableUserModal from "./DisableUserModal";

interface DisableUserInfoModalProps {
  open: boolean;
  userName: string;
  userId: string;
}

export default function UsersContainer(): ReactElement {
  const [disableUserInfoModal, setDisableUserInfoModal] =
    useState<DisableUserInfoModalProps>({
      open: false,
      userName: "",
      userId: "",
    });

  function handleCloseDisableUserInfoModal() {
    setDisableUserInfoModal((prev) => ({
      ...prev,
      open: false,
    }));
  }

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
    select: selectUsersInfo,
  });

  return (
    <>
      <DisableUserModal
        {...disableUserInfoModal}
        onClose={handleCloseDisableUserInfoModal}
      />
      <div className="flex flex-col gap-4 h-full">
        <PageHeader
          title="Usuários"
          primaryButtonLabel="Adicionar usuário"
          onClickPrimaryBtn={() => navigate("/users/new")}
          primaryBtnIconRigth={<PersonAddOutlinedIcon />}
        />
        <DashBoard isLoading={isFetchingDatashBoardInfo}>
          {dashBoardInfo?.map((item) => (
            <DashBoard.Card
              key={item.id}
              label={item.label}
              value={item.value}
            />
          ))}
        </DashBoard>
        <Table.Filter
          onFilterCallback={() => {}}
          formComponent={<div>Teste</div>}
        />
        <Table>
          <Table.Header>
            <Table.Head label="ID" />
            <Table.Head label="Nome" />
            <Table.Head label="Email" />
            <Table.Head label="Celular" />
            <Table.Head label="Status" />
            <Table.Head action />
          </Table.Header>
          <Table.Body
            isLoading={isFetchingUsersInfo}
            isEmpty={!usersInfo?.length}
          >
            {usersInfo?.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell label={user.id} />
                <Table.Cell label={user.fullName} />
                <Table.Cell label={user.email} />
                <Table.Cell label={user.cellphone} />
                <Table.Cell label={user.isActive ? "Ativo" : "Inativo"} />
                <Table.Action>
                  <Button
                    variant="tertiary"
                    fullWidth
                    label="Editar"
                    onClick={() => navigate(`/users/${user.id}`)}
                  />
                  <Button
                    variant="tertiary"
                    fullWidth
                    label="Desativar"
                    onClick={() =>
                      setDisableUserInfoModal((prev) => ({
                        ...prev,
                        open: true,
                        userName: user.fullName,
                        userId: user.id,
                      }))
                    }
                  />
                </Table.Action>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer
            currentStartItem={1}
            itemsCurrentPage={10}
            totalItems={usersInfo?.length}
            onNavigateBeforeCallback={() => {}}
            onNavigateNextCallback={() => {}}
            onExportPdfCallback={() => {}}
            onExportSpreadSheetCallback={() => {}}
          />
        </Table>
      </div>
    </>
  );
}
