import Switch from "@/design-system/Switch";
import Table from "@/design-system/Table";
import AccountStatus from "@/domains/global/components/AccountStatus";
import DataField from "@/domains/global/components/DataField";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { PageablePayload } from "@/domains/global/types";
import { FetchAccountReceivable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import formatFilters from "@/domains/global/utils/formatFilters";
import safeFormat from "@/domains/global/utils/safeFormat";
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

  const isStartAndEndFilterToday = useMemo(() => {
    if (
      !accountsReceivableFilter?.startDate ||
      !accountsReceivableFilter?.endDate
    )
      return false;

    const today = safeFormat({ date: new Date(), format: "yyyy-MM-dd" });
    if (
      accountsReceivableFilter.startDate === today &&
      accountsReceivableFilter.endDate === today
    )
      return true;

    return false;
  }, [accountsReceivableFilter?.startDate, accountsReceivableFilter?.endDate]);

  return (
    <>
      <div className="flex gap-4 justify-between">
        <ExportButton<
          FetchAccountReceivable,
          AccountsReceivableFilterFormInputs
        >
          fileName="Relatório Vendas"
          queryKey={["accounts-receivable", filterFormatted]}
          queryFn={getAccountsReceivableInfo}
          selectQueryFn={selectAccountsReceivableInfoForReport}
          formatFilters={{
            description: "Descrição",
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
            description: "Descrição",
            date: "Data de venda",
            receivedFrom: "Recebido de",
            overallStatus: "Status geral",
            totalValue: "Valor total",
          }}
        />
        <div className="flex gap-4">
          <Switch
            checked={isStartAndEndFilterToday}
            label="Contas de hoje"
            onCheck={() =>
              handleAccountsReceivableFilter({
                startDate: safeFormat({
                  date: new Date(),
                  format: "yyyy-MM-dd",
                }),
                endDate: safeFormat({
                  date: new Date(),
                  format: "yyyy-MM-dd",
                }),
              })
            }
            onUncheck={() =>
              handleAccountsReceivableFilter({
                startDate: "",
                endDate: "",
              })
            }
          />
          <Table.Filter form={<AccountsReceivableFilterForm />} />
        </div>
      </div>
      <div className="w-fit flex gap-4">
        <DataField
          label="Total"
          value={applyMask(
            accountsReceivableInfo?.summary?.totalOverall,
            "money"
          )}
        />
        <DataField
          label="Total Pago"
          value={applyMask(accountsReceivableInfo?.summary?.totalPaid, "money")}
        />
        <DataField
          label="Total Pendente"
          value={applyMask(
            accountsReceivableInfo?.summary?.totalPending,
            "money"
          )}
        />
      </div>
      <Table>
        <Table.Header gridColumns={gridColumns}>
          <Table.Head label={ACCOUNTS_RECEIVABLE_TABLE.description.label} />
          <Table.Head label={ACCOUNTS_RECEIVABLE_TABLE.date.label} />
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
                label={accountReceivable.date}
                columnLabel={ACCOUNTS_RECEIVABLE_TABLE.date.label}
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
