import Table from "@/design-system/Table";
import { useMemo, useState, type ReactNode } from "react";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { BACKEND_URL } from "@/domains/global/constants";
import { FetchUser } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import selectUsersInfo from "../utils/selectUsersInfo";
import UsersFilterForm from "../forms/UsersFilterForm";
import formatFilters from "@/domains/global/utils/formatFilters";
import UsersTableActions from "./UsersTableActions";
import { DisableUser, UsersFilterFormInputs } from "../types";
import DisableUserModal from "./DisableUserModal";
import useDialog from "@/domains/global/hooks/useDialog";
import { PageablePayload } from "@/domains/global/types";
import ExportButton from "@/domains/pdf/components/ExportButton";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import selectUsersInfoForReport from "../utils/selectUsersInfoForReport";

const enableReport = true;

export default function UsersTable(): ReactNode {
  const [disableUserInfo, setDisableUserInfo] = useState<DisableUser>({
    userName: "",
    userId: "",
  });

  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const { usersFilter, handleUsersFilter } = useFilterContext();

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
    return await safeFetch(`${BACKEND_URL}/user?${filter}&orderBy=fullName`, {
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
        {enableReport && (
          <ExportButton<FetchUser, UsersFilterFormInputs>
            fileName="Relatório Usuários"
            queryKey={["users", filterFormatted]}
            queryFn={getUsersInfo}
            selectQueryFn={selectUsersInfoForReport}
            formatFilters={{
              fullName: "Nome completo",
              status: "Status",
              startDate: "Data inicial",
              endDate: "Data final",
            }}
            formatFiltersValues={{
              status: {
                active: "Ativo",
                inactive: "Inativo",
              },
            }}
            formatColumns={{
              fullName: "Nome",
              cpf: "CPF",
              email: "Email",
              phone: "Celular",
              archivedAt: "Ativo",
            }}
          />
        )}
        <Table.Filter form={<UsersFilterForm />} />
      </div>
      <Table>
        <Table.Header>
          <Table.Head label="Nome completo" />
          <Table.Head label="CPF" />
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
              <Table.Cell label={user.fullName} />
              <Table.Cell label={user.cpf} />
              <Table.Cell label={user.email} />
              <Table.Cell label={user.phone} />
              <Table.Cell label={user.archivedAt ? "Inativo" : "Ativo"} />
              <Table.Action>
                <UsersTableActions
                  isActive={!user.archivedAt}
                  userId={String(user.id)}
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
