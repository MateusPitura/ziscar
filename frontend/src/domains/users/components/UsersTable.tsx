import Table from "@/design-system/Table";
import { useMemo, useState, type ReactNode } from "react";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { baseUrl } from "@/domains/global/constants/requests";
import { User } from "@/domains/global/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import selectUsersInfo from "../utils/selectUsersInfo";
import UsersFilterForm from "../forms/UsersFilterForm";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import formatFilters from "@/domains/global/utils/formatFilters";
import UsersTableActions from "./UsersTableActions";
import { DisableUser } from "../types/disableUser";
import DisableUserModal from "./DisableUserModal";
import useDialog from "@/domains/global/hooks/useDialog";
import { queryKeys } from "@/domains/global/types/queryKeys";

export default function UsersTable(): ReactNode {
  const [disableUserInfo, setDisableUserInfo] = useState<DisableUser>({
    userName: "",
    userId: "",
  });

  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const { usersFilter, handleUsersFilter } = useGlobalContext();
  const { userLogged } = useGlobalContext();

  function handleDisableUserInfo(user: DisableUser) {
    dialog.openDialog();
    setDisableUserInfo(user);
  }

  function handleChangePage(page: number) {
    handleUsersFilter({ page });
  }

  const filterFormatted = useMemo(() => {
    const userFilter = { ...usersFilter, notUserId: userLogged?.id }; // TODO: no backend deveria manter todos o usuário menos o usuário logado
    if (userFilter) {
      return formatFilters(userFilter);
    }
    return "";
  }, [usersFilter, userLogged]);

  async function getUsersInfo(filter?: string): Promise<User[]> {
    return await safeFetch(`${baseUrl}/users?${filter}`, {
      resource: "users",
      action: "read",
    });
  }

  const { data: usersInfo, isFetching: isFetchingUsersInfo } = useQuery({
    queryKey: [queryKeys.USERS, filterFormatted],
    queryFn: ({ queryKey }) => getUsersInfo(queryKey[1]),
    select: selectUsersInfo,
  });

  const { showSuccessSnackbar } = useSnackbar();

  async function generatePdf() {
    return await safeFetch(`${baseUrl}/usersPdf`, {
      method: "post",
      body: {
        filter: usersFilter,
        url: "https://example.com/", // TODO: ao implementar o back seria enviado apenas o filter
      },
      resource: "users",
      action: "read",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: generatePdf,
    onSuccess: (data) => {
      showSuccessSnackbar({
        title: "PDF gerado com sucesso",
        actionLabel: "Abrir",
        onActionClick: () => window.open(data.url, "_blank"),
        actionBtnResource: 'users',
        actionBtnAction: 'read'
      });
    },
  });

  return (
    <>
      <DisableUserModal {...disableUserInfo} {...dialog} />
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
          resource="users"
          action="read"
        >
          {usersInfo?.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell label={user.id} />
              <Table.Cell label={user.fullName} />
              <Table.Cell label={user.email} />
              <Table.Cell label={user.cellphone} />
              <Table.Cell label={user.isActive ? "Ativo" : "Inativo"} />
              <Table.Action>
                <UsersTableActions
                  isActive={user.isActive}
                  userId={user.id}
                  fullName={user.fullName}
                  handleDisableUserInfo={handleDisableUserInfo}
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer
          currentStartItem={usersFilter?.page}
          totalItems={usersInfo?.length}
          onClickNavigateBtn={handleChangePage}
          onClickPdfBtn={mutate}
          pdfBtnState={isPending ? "loading" : undefined}
          isLoading={isFetchingUsersInfo}
          resourceExportBtn="users"
          actionExportBtn="read"
        />
      </Table>
    </>
  );
}
