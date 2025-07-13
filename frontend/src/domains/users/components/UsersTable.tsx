import Table from "@/design-system/Table";
import { useMemo, useState, type ReactNode } from "react";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { BACKEND_URL } from "@/domains/global/constants";
import { User } from "@/domains/global/types/model";
import { useMutation, useQuery } from "@tanstack/react-query";
import selectUsersInfo from "../utils/selectUsersInfo";
import UsersFilterForm from "../forms/UsersFilterForm";
import useGlobalContext from "@/domains/global/hooks/useGlobalContext";
import formatFilters from "@/domains/global/utils/formatFilters";
import UsersTableActions from "./UsersTableActions";
import { DisableUser } from "../types";
import DisableUserModal from "./DisableUserModal";
import useDialog from "@/domains/global/hooks/useDialog";
import { PageablePayload } from "@/domains/global/types";
import handleExportFile from "@/domains/global/utils/handleExportFile";
import Button from "@/design-system/Button";

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

  const filterExportFormatted = useMemo(() => {
    if (usersFilter) {
      return formatFilters({
        fullName: usersFilter.fullName,
        status: usersFilter.status,
        orderBy: usersFilter.orderBy,
      });
    }
    return "";
  }, [usersFilter]);

  async function getUsersInfo(filter?: string): Promise<PageablePayload<User>> {
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

  const { showSuccessSnackbar } = useSnackbar();

  async function generatePdf(): Promise<Response> {
    return await safeFetch(`${BACKEND_URL}/user/pdf?${filterExportFormatted}`, {
      method: "GET",
      resource: "USERS",
      action: "READ",
      isExport: true,
    });
  }

  const { mutate: pdfMutate, isPending: isPdfPending } = useMutation({
    mutationFn: generatePdf,
    onSuccess: (data: Response) => {
      showSuccessSnackbar({
        title: "PDF gerado com sucesso",
        actionLabel: "Baixar",
        onActionClick: async () => {
          handleExportFile({
            data,
            fileName: "users",
            type: "pdf",
          });
        },
        actionBtnResource: "USERS",
        actionBtnAction: "READ",
      });
    },
  });

  return (
    <>
      <DisableUserModal {...disableUserInfo} {...dialog} />
      <div className="flex gap-4 justify-end">
        <Button
          variant="primary"
          color="darkBlue"
          label="Exportar como PDF"
          iconRight="FileDownload"
          onClick={pdfMutate}
          state={isPdfPending ? "loading" : undefined}
          resource="USERS"
          action="READ"
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
