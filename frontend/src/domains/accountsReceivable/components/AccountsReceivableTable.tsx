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
import { BLANK } from "@/domains/global/constants";
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
    console.log("filter: ", filter);
    return {
      total: 3,
      data: [
        {
          id: 1,
          description: "Conta a receber 1",
          receivedFrom: "Cliente A",
          totalValue: "10000",
          overallStatus: "PENDING",
          installmentsNumber: 2,
          vehicleSaleId: 1,
        },
        {
          id: 2,
          description: "Conta a receber 2",
          receivedFrom: "Cliente B",
          totalValue: "5000",
          overallStatus: "PENDING",
          installmentsNumber: 1,
          vehicleSaleId: 3,
        },
        {
          id: 3,
          description: "Conta a receber 3",
          receivedFrom: "Cliente C",
          totalValue: "15000",
          overallStatus: "PAID",
          installmentsNumber: 3,
          vehicleSaleId: 4,
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

  const biggestValueLength = useMemo(() => {
    if (!accountsReceivableInfo?.data.length) return 0;
    return Math.max(
      ...accountsReceivableInfo.data.map((v) => v.totalValue.length)
    );
  }, [accountsReceivableInfo?.data]);

  return (
    <>
      <div className="flex gap-4 justify-end">
        <ExportButton<
          FetchAccountReceivable,
          AccountsReceivableFilterFormInputs
        >
          fileName="Relatório Contas a Receber"
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
            installmentsNumber: "Número de parcelas",
            description: "Descrição",
            receivedFrom: "Recebido de",
            totalValue: "Valor total",
            overallStatus: "Status geral",
          }}
        />
        <Table.Filter form={<AccountsReceivableFilterForm />} />
      </div>
      <Table>
        <Table.Header gridColumns={10}>
          <Table.Head label="Descrição" />
          <Table.Head label="Número de parcelas" />
          <Table.Head label="Recebido de" />
          <Table.Head label="Status geral do pagamento" />
          <Table.Head label="Valor total" colSpan={1} />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingAccountsReceivableInfo}
          isEmpty={!accountsReceivableInfo?.total}
          resource="ACCOUNTS_RECEIVABLE"
          action="READ"
        >
          {accountsReceivableInfo?.data.map((accountReceivable) => (
            <Table.Row key={accountReceivable.id} gridColumns={10}>
              <Table.Cell label={accountReceivable.description} />
              <Table.Cell label={accountReceivable.installmentsNumber} />
              <Table.Cell label={accountReceivable.receivedFrom} />
              <Table.Cell
                label={
                  <AccountStatus status={accountReceivable.overallStatus} />
                }
              />
              <Table.Cell
                label={accountReceivable.totalValue.padStart(
                  biggestValueLength,
                  BLANK
                )}
                className="font-mono whitespace-pre"
                colSpan={1}
              />
              <Table.Action>
                <AccountsReceivableTableActions
                  accountReceivableId={String(accountReceivable.id)}
                  vehicleSaleId={String(accountReceivable.vehicleSaleId)}
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
