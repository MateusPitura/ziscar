import Table from "@/design-system/Table";
import { useState, type ReactNode } from "react";
import DisableUserModal from "./DisableUserModal";
import { DisableUser } from "../types/disableUser";
import useDialog from "@/domains/profile/hooks/useDialog";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { baseUrl } from "@/domains/global/constants/requests";
import { User } from "@/domains/global/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import selectUsersInfo from "../utils/selectUsersInfo";
import UsersFilterForm from "../forms/UsersFilterForm";
import Button from "@/design-system/Button";
import { useNavigate } from "react-router-dom";

export default function UsersTable(): ReactNode {
  const [disableUserInfo, setDisableUserInfo] = useState<DisableUser>({
    userName: "",
    userId: "",
  });
  const [usersFilter, setUsersFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { isOpen, closeDialog, openDialog } = useDialog();
  const { showSuccessSnackbar } = useSnackbar();
  const { safeFetch } = useSafeFetch();
  const navigate = useNavigate();

  function handleUsersFilter(value: string) {
    setUsersFilter(value);
  }

  async function getUsersInfo(page: number, filter: string): Promise<User[]> {
    return await safeFetch({
      path: `${baseUrl}/users?page=${page}${filter && "&" + filter}`,
    });
  }

  const { data: usersInfo, isFetching: isFetchingUsersInfo } = useQuery({
    queryKey: ["users", currentPage, usersFilter] as const,
    queryFn: ({ queryKey }) => getUsersInfo(queryKey[1], queryKey[2]),
    select: selectUsersInfo,
  });

  async function generatePdf() {
    return await safeFetch({
      path: `${baseUrl}/usersPdf`,
      method: "POST",
      body: {
        filter: usersFilter,
        url: "https://example.com/", // TODO: ao implementar o back seria enviado apenas o filter
      },
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: generatePdf,
    onSuccess: (data) => {
      showSuccessSnackbar({
        title: "PDF gerado com sucesso",
        actionLabel: "Abrir",
        onActionClick: () => window.open(data.url, "_blank"),
      });
    },
  });

  return (
    <>
      <DisableUserModal
        {...disableUserInfo}
        open={isOpen}
        onClose={closeDialog}
      />
      <Table.Filter
        formComponent={<UsersFilterForm setUsersFilter={handleUsersFilter} />}
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
                  onClick={() => {
                    openDialog();
                    setDisableUserInfo({
                      userName: user.fullName,
                      userId: user.id,
                    });
                  }}
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer
          currentStartItem={currentPage}
          onNavigateCallback={setCurrentPage}
          totalItems={usersInfo?.length}
          onExportPdfCallback={mutate}
          exportPdfBtnState={isPending ? "loading" : undefined}
          isLoading={isFetchingUsersInfo}
        />
      </Table>
    </>
  );
}
