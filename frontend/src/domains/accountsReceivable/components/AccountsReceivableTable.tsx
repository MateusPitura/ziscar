import Table from "@/design-system/Table";
import AccountStatus from "@/domains/global/components/AccountStatus";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { PageablePayload } from "@/domains/global/types";
import { FetchAccountReceivable } from "@/domains/global/types/model";
import formatFilters from "@/domains/global/utils/formatFilters";
import ExportButton from "@/domains/pdf/components/ExportButton";
import { useQuery } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { ACCOUNTS_RECEIVABLE_TABLE } from "../constants";
import { AccountsReceivableFilterFormInputs } from "../types";
import selectAccountsReceivableInfo from "../utils/selectAccountsReceivableInfo";
import selectAccountsReceivableInfoForReport from "../utils/selectAccountsReceivableInfoForReport";
import AccountsReceivableFilterForm from "./AccountsReceivableFilterForm";
import AccountsReceivableTableActions from "./AccountsReceivableTableActions";

const gridColumns = 10;

export default function AccountsReceivableTable(): ReactNode {
  const { safeFetch } = useSafeFetch();
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
    return await safeFetch(
      `${BACKEND_URL}/account-receivable/search?${filter}&orderBy=description`,
      {
        resource: "ACCOUNTS_RECEIVABLE",
        action: "READ",
      }
    );
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
        <Table.Header gridColumns={gridColumns}>
          <Table.Head label={ACCOUNTS_RECEIVABLE_TABLE.description.label} />
          <Table.Head
            label={ACCOUNTS_RECEIVABLE_TABLE.installmentsNumber.label}
          />
          <Table.Head label={ACCOUNTS_RECEIVABLE_TABLE.receivedFrom.label} />
          <Table.Head
            label={ACCOUNTS_RECEIVABLE_TABLE.overallStatus.label}
            colSpan={ACCOUNTS_RECEIVABLE_TABLE.overallStatus.colSpan}
          />
          <Table.Head label={ACCOUNTS_RECEIVABLE_TABLE.totalValue.label} />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingAccountsReceivableInfo}
          isEmpty={!accountsReceivableInfo?.total}
          resource="ACCOUNTS_RECEIVABLE"
          action="READ"
        >
          {accountsReceivableInfo?.data.map((accountReceivable) => (
            <Table.Row key={accountReceivable.id} gridColumns={gridColumns}>
              <Table.Cell
                label={accountReceivable.description}
                columnLabel={ACCOUNTS_RECEIVABLE_TABLE.description.label}
              />
              <Table.Cell
                label={accountReceivable.installmentsNumber}
                columnLabel={ACCOUNTS_RECEIVABLE_TABLE.installmentsNumber.label}
              />
              <Table.Cell
                label={accountReceivable.receivedFrom}
                columnLabel={ACCOUNTS_RECEIVABLE_TABLE.receivedFrom.label}
              />
              <Table.Cell
                label={
                  <AccountStatus status={accountReceivable.overallStatus} />
                }
                columnLabel={ACCOUNTS_RECEIVABLE_TABLE.overallStatus.label}
                colSpan={ACCOUNTS_RECEIVABLE_TABLE.overallStatus.colSpan}
              />
              <Table.Cell
                label={accountReceivable.totalValue.padStart(
                  biggestValueLength,
                  BLANK
                )}
                className="font-mono whitespace-pre"
                columnLabel={ACCOUNTS_RECEIVABLE_TABLE.totalValue.label}
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
