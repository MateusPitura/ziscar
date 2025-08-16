import Table from "@/design-system/Table";
import AccountStatus from "@/domains/global/components/AccountStatus";
import { PageablePayload } from "@/domains/global/types";
import { FetchAccountReceivableInstallment } from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode } from "react";
import selectAccountsReceivableInstallmentsInfo from "../utils/selectAccountsReceivableInstallmentsInfo";
import AccountsReceivableInstallmentsTableActions from "./AccountsReceivableTableInstallmentsActions";
import { useParams } from "react-router-dom";
// import { BACKEND_URL } from "@/domains/global/constants";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";

export default function AccountsReceivableInstallmentsTable(): ReactNode {
  //   const { safeFetch } = useSafeFetch();
  const { accountReceivableId } = useParams();

  async function getAccountsReceivableInstallmentsInfo(): Promise<
    PageablePayload<FetchAccountReceivableInstallment>
  > {
    // return await safeFetch(`${BACKEND_URL}/account-receivable-installments/${accountReceivableId}`, {
    //   resource: "ACCOUNTS_RECEIVABLE",
    //   action: "READ",
    // });
    return {
      total: 3,
      data: [
        {
          id: 1,
          dueDate: "2025-01-01",
          installmentSequence: 0,
          status: "PAID",
          value: "10000",
          isRefund: false,
          isUpfront: true,
        },
        {
          id: 2,
          dueDate: "2025-01-01",
          installmentSequence: 1,
          status: "PAID",
          value: "10000",
          isRefund: false,
          isUpfront: false,
        },
        {
          id: 3,
          dueDate: "2025-02-01",
          installmentSequence: 2,
          status: "PENDING",
          value: "10000",
          isRefund: false,
          isUpfront: false,
        },
        {
          id: 4,
          dueDate: "2025-03-01",
          installmentSequence: 3,
          status: "PENDING",
          value: "10000",
          isRefund: false,
          isUpfront: false,
        },
      ],
    };
  }

  const {
    data: accountsReceivableInstallmentsInfo,
    isFetching: isFetchingAccountsReceivableInstallmentsInfo,
  } = useQuery({
    queryKey: ["accounts-receivable-installments", accountReceivableId],
    queryFn: getAccountsReceivableInstallmentsInfo,
    select: selectAccountsReceivableInstallmentsInfo,
  });

  return (
    <Table>
      <Table.Header>
        <Table.Head label="ID" />
        <Table.Head label="Sequência" />
        <Table.Head label="Vencimento" />
        <Table.Head label="Valor" />
        <Table.Head label="Status" />
        <Table.Head action />
      </Table.Header>
      <Table.Body
        isLoading={isFetchingAccountsReceivableInstallmentsInfo}
        isEmpty={!accountsReceivableInstallmentsInfo?.total}
        resource="ACCOUNTS_RECEIVABLE"
        action="READ"
      >
        {accountsReceivableInstallmentsInfo?.data.map((installment) => (
          <Table.Row key={installment.id}>
            <Table.Cell label={String(installment.id)} />
            <Table.Cell
              label={
                installment.isUpfront
                  ? "Entrada"
                  : `${installment.installmentSequence}/${accountsReceivableInstallmentsInfo?.total}`
              }
            />
            <Table.Cell label={installment.dueDate} />
            <Table.Cell label={installment.value} />
            <Table.Cell label={<AccountStatus status={installment.status} />} />
            <Table.Action>
              <AccountsReceivableInstallmentsTableActions
                installmentId={String(installment.id)}
              />
            </Table.Action>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
