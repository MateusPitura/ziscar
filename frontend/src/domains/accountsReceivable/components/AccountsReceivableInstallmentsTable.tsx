import Table from "@/design-system/Table";
import AccountExpired from "@/domains/global/components/AccountExpired";
import AccountStatus from "@/domains/global/components/AccountStatus";
import DataField from "@/domains/global/components/DataField";
import {
  BACKEND_URL,
  BLANK,
  PaymentMethodReceivableText,
} from "@/domains/global/constants";
import useDialog from "@/domains/global/hooks/useDialog";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import {
  AccountReceivableInstallment,
  FetchAccountReceivableInstallment,
} from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { removeMask } from "@shared/utils/removeMask";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE } from "../constants";
import selectAccountsReceivableInstallmentsInfo from "../utils/selectAccountsReceivableInstallmentsInfo";
import AccountsReceivableInstallmentsTableActions from "./AccountsReceivableTableInstallmentsActions";
import PaymentMethodModal from "./PaymentMethodModal";

const gridColumns = 11;

export default function AccountsReceivableInstallmentsTable(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { accountReceivableId } = useParams();
  const [installmentToPaymentMethod, setInstallmentToPaymentMethod] =
    useState<AccountReceivableInstallment | null>(null);

  const dialog = useDialog();

  function handleInstallmentToPaymentMethodInfo(
    installment: AccountReceivableInstallment
  ) {
    dialog.openDialog();
    setInstallmentToPaymentMethod(installment);
  }

  async function getAccountsReceivableInstallmentsInfo(): Promise<
    FetchAccountReceivableInstallment[]
  > {
    return await safeFetch(
      `${BACKEND_URL}/account-receivable-installments/by-account/${accountReceivableId}`,
      {
        resource: "ACCOUNTS_RECEIVABLE",
        action: "READ",
      }
    );
  }

  const {
    data: accountsReceivableInstallmentsInfo,
    isFetching: isFetchingAccountsReceivableInstallmentsInfo,
  } = useQuery({
    queryKey: ["accounts-receivable-installments", accountReceivableId],
    queryFn: getAccountsReceivableInstallmentsInfo,
    select: selectAccountsReceivableInstallmentsInfo,
  });

  const biggestValueLength = useMemo(() => {
    if (!accountsReceivableInstallmentsInfo?.length) return 0;
    return Math.max(
      ...accountsReceivableInstallmentsInfo.map((v) => v.value.length)
    );
  }, [accountsReceivableInstallmentsInfo]);

  const summary = useMemo(() => {
    if (!accountsReceivableInstallmentsInfo?.length)
      return {
        totalOverall: 0,
        totalPaid: 0,
        totalPending: 0,
      };

    const totalPaid =
      accountsReceivableInstallmentsInfo
        .filter((s) => s.status === "PAID")
        ?.reduce((acc, curr) => acc + Number(removeMask(curr.value)), 0) ?? 0;

    const totalPending =
      accountsReceivableInstallmentsInfo
        .filter((s) => s.status === "PENDING")
        ?.reduce((acc, curr) => acc + Number(removeMask(curr.value)), 0) ?? 0;

    return {
      totalOverall: totalPaid + totalPending,
      totalPaid,
      totalPending,
    };
  }, [accountsReceivableInstallmentsInfo]);

  return (
    <>
      <PaymentMethodModal
        installment={installmentToPaymentMethod}
        {...dialog}
      />
      <div className="w-fit flex gap-4">
        <DataField
          label="Total"
          value={applyMask(summary?.totalOverall, "money")}
        />
        <DataField
          label="Total Pago"
          value={applyMask(summary?.totalPaid, "money")}
        />
        <DataField
          label="Total Pendente"
          value={applyMask(summary?.totalPending, "money")}
        />
      </div>
      <Table>
        <Table.Header gridColumns={gridColumns}>
          <Table.Head
            label={
              ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.installmentSequence.label
            }
            colSpan={
              ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.installmentSequence.colSpan
            }
          />
          <Table.Head
            label={ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.dueDate.label}
          />
          <Table.Head
            label={ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.paymentDate.label}
          />
          <Table.Head
            label={ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.paymentMethod.label}
          />
          <Table.Head
            label={ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.status.label}
          />
          <Table.Head
            label={ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.value.label}
            colSpan={
              ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.installmentSequence.colSpan
            }
          />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingAccountsReceivableInstallmentsInfo}
          isEmpty={!accountsReceivableInstallmentsInfo?.length}
          resource="ACCOUNTS_RECEIVABLE"
          action="READ"
        >
          {accountsReceivableInstallmentsInfo?.map((installment) => (
            <Table.Row key={installment.id} gridColumns={gridColumns}>
              <Table.Cell
                columnLabel={
                  ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.installmentSequence
                    .label
                }
                colSpan={
                  ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.installmentSequence
                    .colSpan
                }
                label={
                  installment.isUpfront
                    ? "Entrada"
                    : `${installment.installmentSequence}/${
                        accountsReceivableInstallmentsInfo.filter(
                          (account) => !account.isUpfront
                        )?.length
                      }`
                }
              />
              <Table.Cell
                columnLabel={
                  ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.dueDate.label
                }
                label={
                  <div className="flex gap-1 text-center">
                    {installment.dueDate}{" "}
                    {installment.isExpired && <AccountExpired />}
                  </div>
                }
              />
              <Table.Cell
                columnLabel={
                  ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.paymentDate.label
                }
                label={
                  installment.paymentMethodReceivables?.length
                    ? installment.paymentMethodReceivables[0].paymentDate
                    : ""
                }
              />
              <Table.Cell
                columnLabel={
                  ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.paymentMethod.label
                }
                label={
                  installment.paymentMethodReceivables?.length
                    ? PaymentMethodReceivableText[
                        installment.paymentMethodReceivables[0].type
                      ]
                    : ""
                }
              />
              <Table.Cell
                columnLabel={
                  ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.status.label
                }
                label={<AccountStatus status={installment.status} />}
              />
              <Table.Cell
                columnLabel={ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.value.label}
                label={installment.value.padStart(biggestValueLength, BLANK)}
                className="font-mono whitespace-pre"
                colSpan={ACCOUNTS_RECEIVABLE_INSTALLMENTS_TABLE.value.colSpan}
              />
              <Table.Action>
                <AccountsReceivableInstallmentsTableActions
                  installment={installment}
                  handleInstallmentToPaymentMethodInfo={
                    handleInstallmentToPaymentMethodInfo
                  }
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
