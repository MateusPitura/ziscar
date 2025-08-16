import Table from "@/design-system/Table";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import { PageablePayload } from "@/domains/global/types";
import formatFilters from "@/domains/global/utils/formatFilters";
import ExportButton from "@/domains/pdf/components/ExportButton";
import { useQuery } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { AccountsReceivableFilterFormInputs } from "../types";
import { FetchAccountReceivable } from "@/domains/global/types/model";
import selectAccountsReceivableInfo from "../utils/selectAccountsReceivableInfo";
import AccountsReceivableTableActions from "./AccountsReceivableTableActions";
import AccountsReceivableFilterForm from "./AccountsReceivableFilterForm";
import AccountStatus from "@/domains/global/components/AccountStatus";
import selectAccountsReceivableInfoForReport from "../utils/selectAccountsReceivableInfoForReport";
// import { BACKEND_URL } from "@/domains/global/constants";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";

export default function AccountsReceivableTable(): ReactNode {
  // const { safeFetch } = useSafeFetch();
  const { accountsReceivableFilter, handleAccountsReceivableFilter } =
    useFilterContext();

  function handleChangePage(page: number) {
    handleAccountsReceivableFilter({ page });
  }

  const filterFormatted = useMemo(() => {
    if (accountsReceivableFilter) {
      return formatFilters(accountsReceivableFilter);
    }
    return "";
  }, [accountsReceivableFilter]);

  async function getAccountsReceivableInfo(
    filter?: string
  ): Promise<PageablePayload<FetchAccountReceivable>> {
    // return await safeFetch(`${BACKEND_URL}/account-receivable?${filter}`, {
    //   resource: "ACCOUNTS_RECEIVABLE",
    //   action: "READ",
    // });
    console.log("🌠 filter: ", filter);
    return {
      total: 3,
      data: [
        {
          id: 1,
          description: "Conta a receber 1",
          receivedFrom: "Cliente A",
          totalValue: "10000",
          overallStatus: "PENDING",
        },
        {
          id: 2,
          description: "Conta a receber 2",
          receivedFrom: "Cliente B",
          totalValue: "5000",
          overallStatus: "PENDING",
        },
        {
          id: 3,
          description: "Conta a receber 3",
          receivedFrom: "Cliente C",
          totalValue: "15000",
          overallStatus: "PAID",
        },
      ],
    };
  }

  const {
    data: accountsReceivableInfo,
    isFetching: isFetchingAccountsReceivableInfo,
  } = useQuery({
    queryKey: ["accounts-receivable", filterFormatted],
    queryFn: ({ queryKey }) => getAccountsReceivableInfo(queryKey[1]),
    select: selectAccountsReceivableInfo,
  });

  return (
    <>
      <div className="flex gap-4 justify-end">
        <ExportButton<
          FetchAccountReceivable,
          AccountsReceivableFilterFormInputs
        >
          fileName="Relatório Contas a Receber"
          resource="ACCOUNTS_RECEIVABLE"
          queryKey={["accounts-receivable", filterFormatted]}
          queryFn={getAccountsReceivableInfo}
          selectQueryFn={selectAccountsReceivableInfoForReport}
          formatFilters={{
            endDate: "Data final",
            startDate: "Data inicial",
            overallStatus: "Status geral",
          }}
          formatFiltersValues={{
            overallStatus: {
              PAID: "Pago",
              PENDING: "Pendente",
            },
          }}
          formatColumns={{
            id: "ID",
            description: "Descrição",
            receivedFrom: "Recebido de",
            totalValue: "Valor total",
            overallStatus: "Status geral",
          }}
        />
        <Table.Filter form={<AccountsReceivableFilterForm />} />
      </div>
      <Table>
        <Table.Header>
          <Table.Head label="ID" />
          <Table.Head label="Descrição" />
          <Table.Head label="Recebido de" />
          <Table.Head label="Valor total" />
          <Table.Head label="Status geral" />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingAccountsReceivableInfo}
          isEmpty={!accountsReceivableInfo?.total}
          resource="ACCOUNTS_RECEIVABLE"
          action="READ"
        >
          {accountsReceivableInfo?.data.map((accountReceivable) => (
            <Table.Row key={accountReceivable.id}>
              <Table.Cell label={String(accountReceivable.id)} />
              <Table.Cell label={accountReceivable.description} />
              <Table.Cell label={accountReceivable.receivedFrom} />
              <Table.Cell label={accountReceivable.totalValue} />
              <Table.Cell
                label={
                  <AccountStatus status={accountReceivable.overallStatus} />
                }
              />
              <Table.Action>
                <AccountsReceivableTableActions
                  accountReceivableId={String(accountReceivable.id)}
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer
          currentStartItem={accountsReceivableFilter?.page}
          totalItems={accountsReceivableInfo?.total}
          onClickNavigateBtn={handleChangePage}
          isLoading={isFetchingAccountsReceivableInfo}
        />
      </Table>
    </>
  );
}
