import Table from "@/design-system/Table";
import { useMemo, useState, type ReactNode } from "react";
import DisableUserModal from "./DisableUserModal";
import { DisableUser } from "../types/disableUser";
import useDialog from "@/domains/global/hooks/useDialog";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { baseUrl } from "@/domains/global/constants/requests";
import { User } from "@/domains/global/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import selectUsersInfo from "../utils/selectUsersInfo";
import UsersFilterForm from "../forms/UsersFilterForm";
import Button from "@/design-system/Button";
import { useNavigate } from "react-router-dom";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import formatFilters from "@/domains/global/utils/formatFilters";

export default function UsersTable(): ReactNode {
  const [disableUserInfo, setDisableUserInfo] = useState<DisableUser>({
    userName: "",
    userId: "",
  });

  const { isOpen, closeDialog, openDialog } = useDialog();

  const { safeFetch } = useSafeFetch();

  const { usersFilter, handleUsersFilter } = useGlobalContext();

  function handleChangePage(page: number) {
    handleUsersFilter({ page });
  }

  const filterFormatted = useMemo(() => {
    if (usersFilter) {
      return formatFilters(usersFilter);
    }
    return "";
  }, [usersFilter]);

  async function getUsersInfo(filter?: string): Promise<User[]> {
    return await safeFetch({
      path: `${baseUrl}/users?${filter}`,
    });
  }

  const { data: usersInfo, isFetching: isFetchingUsersInfo } = useQuery({
    queryKey: ["users", filterFormatted],
    queryFn: ({ queryKey }) => getUsersInfo(queryKey[1]),
    select: selectUsersInfo,
  });

  const { showSuccessSnackbar } = useSnackbar();

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

  const navigate = useNavigate();

  return (
    <>
      <DisableUserModal
        {...disableUserInfo}
        open={isOpen}
        onClose={closeDialog}
      />
      <Table.Filter form={<UsersFilterForm />} />
      <Table>
        <Table.Header>
          <Table.Head label="ID" />
          <Table.Head label="Nome completo" />
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
          currentStartItem={usersFilter?.page}
          totalItems={usersInfo?.length}
          onNavigateCallback={handleChangePage}
          onExportPdfCallback={mutate}
          exportPdfBtnState={isPending ? "loading" : undefined}
          isLoading={isFetchingUsersInfo}
        />
      </Table>
    </>
  );
}
