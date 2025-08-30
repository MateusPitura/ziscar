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
import { AccountsReceivableFilterFormInputs } from "../types";
import selectAccountsReceivableInfo from "../utils/selectAccountsReceivableInfo";
import selectAccountsReceivableInfoForReport from "../utils/selectAccountsReceivableInfoForReport";
import AccountsReceivableFilterForm from "./AccountsReceivableFilterForm";
import AccountsReceivableTableActions from "./AccountsReceivableTableActions";

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
    return await safeFetch(`${BACKEND_URL}/account-receivable/search?${filter}`, {
      resource: "ACCOUNTS_RECEIVABLE",
      action: "READ",
    });
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
