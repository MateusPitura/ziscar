import Table from "@/design-system/Table";
import AccountStatus from "@/domains/global/components/AccountStatus";
import {
    BACKEND_URL,
    BLANK,
    PaymentMethodPayableText,
} from "@/domains/global/constants";
import useDialog from "@/domains/global/hooks/useDialog";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import {
    AccountPayableInstallment,
    FetchAccountPayableInstallment,
} from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE } from "../constants";
import selectAccountsPayableInstallmentsInfo from "../utils/selectAccountsPayableInstallmentsInfo";
import AccountsPayableInstallmentsTableActions from "./AccountsPayableTableInstallmentsActions";
import PaymentMethodModal from "./PaymentMethodModal";

const gridColumns = 11;

export default function AccountsPayableInstallmentsTable(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { accountPayableId } = useParams();
  const [installmentToPaymentMethod, setInstallmentToPaymentMethod] =
    useState<AccountPayableInstallment | null>(null);

  const dialog = useDialog();

  function handleInstallmentToPaymentMethodInfo(
    installment: AccountPayableInstallment
  ) {
    dialog.openDialog();
    setInstallmentToPaymentMethod(installment);
  }

  async function getAccountsPayableInstallmentsInfo(): Promise<
    FetchAccountPayableInstallment[]
  > {
    return await safeFetch(
      `${BACKEND_URL}/account-payable-installments/by-account-payable/${accountPayableId}`,
      {
        resource: "ACCOUNTS_PAYABLE",
        action: "READ",
      }
    );
  }

  const {
    data: accountsPayableInstallmentsInfo,
    isFetching: isFetchingAccountsPayableInstallmentsInfo,
  } = useQuery({
    queryKey: ["accounts-payable-installments", accountPayableId],
    queryFn: getAccountsPayableInstallmentsInfo,
    select: selectAccountsPayableInstallmentsInfo,
  });

  const biggestValueLength = useMemo(() => {
    if (!accountsPayableInstallmentsInfo?.length) return 0;
    return Math.max(
      ...accountsPayableInstallmentsInfo.map((v) => v.value.length)
    );
  }, [accountsPayableInstallmentsInfo]);

  return (
    <>
      <PaymentMethodModal
        installment={installmentToPaymentMethod}
        {...dialog}
      />
      <Table>
        <Table.Header gridColumns={gridColumns}>
          <Table.Head
            label={
              ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.installmentSequence.label
            }
            colSpan={
              ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.installmentSequence.colSpan
            }
          />
          <Table.Head
            label={ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.dueDate.label}
          />
          <Table.Head
            label={ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.paymentDate.label}
          />
          <Table.Head
            label={ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.paymentMethod.label}
          />
          <Table.Head
            label={ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.status.label}
          />
          <Table.Head
            label={ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.value.label}
            colSpan={
              ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.installmentSequence.colSpan
            }
          />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingAccountsPayableInstallmentsInfo}
          isEmpty={!accountsPayableInstallmentsInfo?.length}
          resource="ACCOUNTS_PAYABLE"
          action="READ"
        >
          {accountsPayableInstallmentsInfo?.map((installment) => (
            <Table.Row key={installment.id} gridColumns={gridColumns}>
              <Table.Cell
                columnLabel={
                  ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.installmentSequence
                    .label
                }
                colSpan={
                  ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.installmentSequence
                    .colSpan
                }
                label={
                  installment.isUpfront
                    ? "Entrada"
                    : `${installment.installmentSequence}/${
                        accountsPayableInstallmentsInfo.filter(
                          (account) => !account.isUpfront
                        )?.length
                      }`
                }
              />
              <Table.Cell
                columnLabel={
                  ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.dueDate.label
                }
                label={installment.dueDate}
              />
              <Table.Cell
                columnLabel={
                  ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.paymentDate.label
                }
                label={
                  installment.paymentMethodPayables?.length
                    ? installment.paymentMethodPayables[0].paymentDate
                    : ""
                }
              />
              <Table.Cell
                columnLabel={
                  ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.paymentMethod.label
                }
                label={
                  installment.paymentMethodPayables?.length
                    ? PaymentMethodPayableText[
                        installment.paymentMethodPayables[0].type
                      ]
                    : ""
                }
              />
              <Table.Cell
                columnLabel={
                  ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.status.label
                }
                label={<AccountStatus status={installment.status} />}
              />
              <Table.Cell
                columnLabel={ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.value.label}
                label={installment.value.padStart(biggestValueLength, BLANK)}
                className="font-mono whitespace-pre"
                colSpan={ACCOUNTS_PAYABLE_INSTALLMENTS_TABLE.value.colSpan}
              />
              <Table.Action>
                <AccountsPayableInstallmentsTableActions
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
