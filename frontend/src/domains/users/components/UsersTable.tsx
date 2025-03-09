import Table from "@/design-system/Table";
import { useMemo, useState, type ReactNode } from "react";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { BASE_URL } from "@/domains/global/constants";
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

  const filterPdfFormatted = useMemo(() => {
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
    return await safeFetch(`${BASE_URL}/user?${filter}`, {
      resource: "USERS",
      action: "READ",
    });
  }

  const { data: usersInfo, isFetching: isFetchingUsersInfo } = useQuery({
    queryKey: ["user", filterFormatted],
    queryFn: ({ queryKey }) => getUsersInfo(queryKey[1]),
    select: selectUsersInfo,
  });

  const { showSuccessSnackbar } = useSnackbar();

  async function generatePdf(): Promise<Response> {
    return await safeFetch(`${BASE_URL}/user/pdf?${filterPdfFormatted}`, {
      method: "POST",
      resource: "USERS",
      action: "READ",
      isPdf: true,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: generatePdf,
    onSuccess: (data: Response) => {
      showSuccessSnackbar({
        title: "PDF gerado com sucesso",
        actionLabel: "Abrir",
        onActionClick: async () => {
          const blob = await data.blob();
          const url = window.URL.createObjectURL(blob);
          const element = document.createElement("a");
          element.href = url;
          element.download = "user.pdf"
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        },
        actionBtnResource: "USERS",
        actionBtnAction: "READ",
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
          onClickPdfBtn={mutate}
          pdfBtnState={isPending ? "loading" : undefined}
          isLoading={isFetchingUsersInfo}
          resourceExportBtn="USERS"
          actionExportBtn="READ"
        />
      </Table>
    </>
  );
}
