import Table from "@/design-system/Table";
import { useMemo, useState, type ReactNode } from "react";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { BACKEND_URL } from "@/domains/global/constants";
import { FetchUser } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import selectUsersInfo from "../utils/selectUsersInfo";
import UsersFilterForm from "../forms/UsersFilterForm";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import formatFilters from "@/domains/global/utils/formatFilters";
import UsersTableActions from "./UsersTableActions";
import { DisableUser } from "../types";
import DisableUserModal from "./DisableUserModal";
import useDialog from "@/domains/global/hooks/useDialog";
import { PageablePayload } from "@/domains/global/types";
import ExportButton from "@/domains/pdf/components/ExportButton";

export default function UsersTable(): ReactNode {
  const [disableUserInfo, setDisableUserInfo] = useState<DisableUser>({
    userName: "",
    userId: "",
  });

  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const { usersFilter, handleUsersFilter } = useGlobalContext();

  function handleDisableUserInfo(user: DisableUser) {
    dialog.openDialog();
    setDisableUserInfo(user);
  }

  function handleChangePage(page: number) {
    handleUsersFilter({ page });
  }

  const filterFormatted = useMemo(() => {
    if (usersFilter) {
      return formatFilters(usersFilter);
    }
    return "";
  }, [usersFilter]);

  async function getUsersInfo(
    filter?: string
  ): Promise<PageablePayload<FetchUser>> {
    return await safeFetch(`${BACKEND_URL}/user?${filter}`, {
      resource: "USERS",
      action: "READ",
    });
  }

  const { data: usersInfo, isFetching: isFetchingUsersInfo } = useQuery({
    queryKey: ["users", filterFormatted],
    queryFn: ({ queryKey }) => getUsersInfo(queryKey[1]),
    select: selectUsersInfo,
  });

  return (
    <>
      <DisableUserModal {...disableUserInfo} {...dialog} />
      <div className="flex gap-4 justify-end">
        <ExportButton
          fileName="usuarios"
          resource="USERS"
          queryKey={["users", filterFormatted]}
          queryFn={getUsersInfo}
          formatColumns={{
            id: "ID",
            fullName: "Nome",
            email: "Email",
            cellPhone: "Celular",
            isActive: "Status",
          }}
        />
        <Table.Filter form={<UsersFilterForm />} />
      </div>
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
          isEmpty={!usersInfo?.total}
          resource="USERS"
          action="READ"
        >
          {usersInfo?.data.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell label={user.id} />
              <Table.Cell label={user.fullName} />
              <Table.Cell label={user.email} />
              <Table.Cell label={user.cellPhone} />
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
          totalItems={usersInfo?.total}
          onClickNavigateBtn={handleChangePage}
          isLoading={isFetchingUsersInfo}
        />
      </Table>
    </>
  );
}
