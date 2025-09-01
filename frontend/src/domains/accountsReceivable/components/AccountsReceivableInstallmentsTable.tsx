import Table from "@/design-system/Table";
import AccountStatus from "@/domains/global/components/AccountStatus";
import {
  BACKEND_URL,
  BLANK, PaymentMethodReceivableText
} from "@/domains/global/constants";
import useDialog from "@/domains/global/hooks/useDialog";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import {
  AccountReceivableInstallment,
  FetchAccountReceivableInstallment,
} from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import selectAccountsReceivableInstallmentsInfo from "../utils/selectAccountsReceivableInstallmentsInfo";
import AccountsReceivableInstallmentsTableActions from "./AccountsReceivableTableInstallmentsActions";
import PaymentMethodModal from "./PaymentMethodModal";

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

  return (
    <>
      <PaymentMethodModal
        installment={installmentToPaymentMethod}
        {...dialog}
      />
      <Table>
        <Table.Header gridColumns={11}>
          <Table.Head label="Sequência" colSpan={1} />
          <Table.Head label="Data de vencimento " />
          <Table.Head label="Data de pagamento" />
          <Table.Head label="Método de pagamento" />
          <Table.Head label="Status do pagamento" />
          <Table.Head label="Valor" colSpan={1} />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingAccountsReceivableInstallmentsInfo}
          isEmpty={!accountsReceivableInstallmentsInfo?.length}
          resource="ACCOUNTS_RECEIVABLE"
          action="READ"
        >
          {accountsReceivableInstallmentsInfo?.map((installment) => (
            <Table.Row key={installment.id} gridColumns={11}>
              <Table.Cell
                colSpan={1}
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
              <Table.Cell label={installment.dueDate} />
              <Table.Cell
                label={
                  installment.paymentMethodReceivables?.length
                    ? installment.paymentMethodReceivables[0].paymentDate
                    : ""
                }
              />
              <Table.Cell
                label={
                  installment.paymentMethodReceivables?.length
                    ? PaymentMethodReceivableText[
                        installment.paymentMethodReceivables[0].type
                      ]
                    : ""
                }
              />
              <Table.Cell
                label={<AccountStatus status={installment.status} />}
              />
              <Table.Cell
                label={installment.value.padStart(biggestValueLength, BLANK)}
                className="font-mono whitespace-pre"
                colSpan={1}
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
