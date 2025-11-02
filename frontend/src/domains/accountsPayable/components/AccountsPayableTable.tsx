import Switch from "@/design-system/Switch";
import Table from "@/design-system/Table";
import AccountExpired from "@/domains/global/components/AccountExpired";
import AccountStatus from "@/domains/global/components/AccountStatus";
import DataField from "@/domains/global/components/DataField";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import useFilterContext from "@/domains/global/hooks/useFilterContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { PageablePayload } from "@/domains/global/types";
import { FetchAccountPayable } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { safeFormat, todayFormatted } from "@/domains/global/utils/date";
import formatFilters from "@/domains/global/utils/formatFilters";
import ExportButton from "@/domains/pdf/components/ExportButton";
import { useQuery } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { ACCOUNTS_PAYABLE_TABLE } from "../constants";
import { AccountsPayableFilterFormInputs } from "../types";
import selectAccountsPayableInfo from "../utils/selectAccountsPayableInfo";
import selectAccountsPayableInfoForReport from "../utils/selectAccountsPayableInfoForReport";
import AccountsPayableFilterForm from "./AccountsPayableFilterForm";
import AccountsPayableTableActions from "./AccountsPayableTableActions";

const gridColumns = 10;

export default function AccountsPayableTable(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { accountsPayableFilter, handleAccountsPayableFilter } =
    useFilterContext();

  function handleChangePage(page: number) {
    handleAccountsPayableFilter({ page });
  }

  const filterFormatted = useMemo(() => {
    if (accountsPayableFilter) {
      return formatFilters(accountsPayableFilter);
    }
    return "";
  }, [accountsPayableFilter]);

  async function getAccountsPayableInfo(
    filter?: string
  ): Promise<PageablePayload<FetchAccountPayable>> {
    return await safeFetch(
      `${BACKEND_URL}/account-payable/search?${filter}&orderBy=description`,
      {
        resource: "ACCOUNTS_PAYABLE",
        action: "READ",
      }
    );
  }

  const {
    data: accountsPayableInfo,
    isFetching: isFetchingAccountsPayableInfo,
  } = useQuery({
    queryKey: ["accounts-payable", filterFormatted],
    queryFn: ({ queryKey }) => getAccountsPayableInfo(queryKey[1]),
    select: selectAccountsPayableInfo,
  });

  const biggestValueLength = useMemo(() => {
    if (!accountsPayableInfo?.data.length) return 0;
    return Math.max(
      ...accountsPayableInfo.data.map((v) => v.totalValue.length)
    );
  }, [accountsPayableInfo?.data]);

  const isStartAndEndFilterToday = useMemo(() => {
    if (!accountsPayableFilter?.startDate || !accountsPayableFilter?.endDate)
      return false;

    const today = todayFormatted();
    if (
      accountsPayableFilter.startDate === today &&
      accountsPayableFilter.endDate === today
    )
      return true;

    return false;
  }, [accountsPayableFilter?.startDate, accountsPayableFilter?.endDate]);

  return (
    <>
      <div className="flex gap-4 justify-between">
        <ExportButton<FetchAccountPayable, AccountsPayableFilterFormInputs>
          fileName="Relatório Pagamentos"
          queryKey={["accounts-payable", filterFormatted]}
          queryFn={getAccountsPayableInfo}
          selectQueryFn={selectAccountsPayableInfoForReport}
          formatFilters={{
            endDate: "Data final",
            startDate: "Data inicial",
            overallStatus: "Status geral",
            description: "Descrição",
          }}
          formatFiltersValues={{
            overallStatus: {
              PAID: "Pago",
              PENDING: "Pendente",
            },
          }}
          formatColumns={{
            description: "Descrição",
            date: "Data de vencimento",
            paidTo: "Pago a",
            overallStatus: "Status geral",
            totalValue: "Valor total",
          }}
        />
        <div className="flex gap-4">
          <Switch
            checked={isStartAndEndFilterToday}
            label="Contas de hoje"
            onCheck={() =>
              handleAccountsPayableFilter({
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
              handleAccountsPayableFilter({
                startDate: "",
                endDate: "",
              })
            }
          />
          <Table.Filter form={<AccountsPayableFilterForm />} />
        </div>
      </div>
      <div className="w-fit flex gap-4">
        <DataField
          label="Total"
          value={applyMask(accountsPayableInfo?.summary?.totalOverall, "money")}
        />
        <DataField
          label="Total Pago"
          value={applyMask(accountsPayableInfo?.summary?.totalPaid, "money")}
        />
        <DataField
          label="Total Pendente"
          value={applyMask(accountsPayableInfo?.summary?.totalPending, "money")}
        />
      </div>
      <Table>
        <Table.Header gridColumns={gridColumns}>
          <Table.Head
            label={ACCOUNTS_PAYABLE_TABLE.description.label}
            colSpan={ACCOUNTS_PAYABLE_TABLE.description.colSpan}
          />
          <Table.Head label={ACCOUNTS_PAYABLE_TABLE.date.label} />
          <Table.Head label={ACCOUNTS_PAYABLE_TABLE.paidTo.label} />
          <Table.Head
            label={ACCOUNTS_PAYABLE_TABLE.overallStatus.label}
            colSpan={ACCOUNTS_PAYABLE_TABLE.overallStatus.colSpan}
          />
          <Table.Head
            label={ACCOUNTS_PAYABLE_TABLE.totalValue.label}
            colSpan={ACCOUNTS_PAYABLE_TABLE.totalValue.colSpan}
          />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingAccountsPayableInfo}
          isEmpty={!accountsPayableInfo?.total}
          resource="ACCOUNTS_PAYABLE"
          action="READ"
        >
          {accountsPayableInfo?.data.map((accountPayable) => (
            <Table.Row key={accountPayable.id} gridColumns={gridColumns}>
              <Table.Cell
                label={accountPayable.description}
                colSpan={ACCOUNTS_PAYABLE_TABLE.description.colSpan}
                columnLabel={ACCOUNTS_PAYABLE_TABLE.description.label}
              />
              <Table.Cell
                label={
                  <div className="flex gap-1 text-center">
                    {accountPayable.date}{" "}
                    {accountPayable.isExpired && <AccountExpired />}
                  </div>
                }
                columnLabel={ACCOUNTS_PAYABLE_TABLE.date.label}
              />
              <Table.Cell
                label={accountPayable.paidTo}
                columnLabel={ACCOUNTS_PAYABLE_TABLE.paidTo.label}
              />
              <Table.Cell
                label={<AccountStatus status={accountPayable.overallStatus} />}
                columnLabel={ACCOUNTS_PAYABLE_TABLE.overallStatus.label}
                colSpan={ACCOUNTS_PAYABLE_TABLE.overallStatus.colSpan}
              />
              <Table.Cell
                label={accountPayable.totalValue.padStart(
                  biggestValueLength,
                  BLANK
                )}
                className="font-mono whitespace-pre"
                colSpan={ACCOUNTS_PAYABLE_TABLE.totalValue.colSpan}
                columnLabel={ACCOUNTS_PAYABLE_TABLE.totalValue.label}
              />
              <Table.Action>
                <AccountsPayableTableActions
                  accountPayableId={String(accountPayable.id)}
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer
          currentStartItem={accountsPayableFilter?.page}
          totalItems={accountsPayableInfo?.total}
          onClickNavigateBtn={handleChangePage}
          isLoading={isFetchingAccountsPayableInfo}
        />
      </Table>
    </>
  );
}
