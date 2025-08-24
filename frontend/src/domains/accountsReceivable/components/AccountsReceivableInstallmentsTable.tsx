import Table from "@/design-system/Table";
import AccountStatus from "@/domains/global/components/AccountStatus";
import {
  AccountReceivableInstallment,
  FetchAccountReceivableInstallment,
} from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import selectAccountsReceivableInstallmentsInfo from "../utils/selectAccountsReceivableInstallmentsInfo";
import AccountsReceivableInstallmentsTableActions from "./AccountsReceivableTableInstallmentsActions";
import { useParams } from "react-router-dom";
import useDialog from "@/domains/global/hooks/useDialog";
import PaymentMethodModal from "./PaymentMethodModal";
import { BLANK, PaymentMethodPayableText } from "@/domains/global/constants";
// import { BACKEND_URL } from "@/domains/global/constants";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";

export default function AccountsReceivableInstallmentsTable(): ReactNode {
  //   const { safeFetch } = useSafeFetch();
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
    // return await safeFetch(`${BACKEND_URL}/account-receivable-installments/${accountReceivableId}`, {
    //   resource: "ACCOUNTS_RECEIVABLE",
    //   action: "READ",
    // });
    return [
      {
        id: 1,
        dueDate: "2025-01-01",
        installmentSequence: 0,
        status: "PAID",
        value: "10000",
        isRefund: false,
        isUpfront: true,
        paymentMethod: "CREDIT_CARD",
      },
      {
        id: 2,
        dueDate: "2025-01-01",
        installmentSequence: 1,
        status: "PAID",
        value: "10000",
        isRefund: false,
        isUpfront: false,
        paymentMethod: "CREDIT_CARD",
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
        value: "100000",
        isRefund: false,
        isUpfront: false,
      },
    ];
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
        <Table.Header gridColumns={10}>
          <Table.Head label="Vencimento" />
          <Table.Head label="Sequência" />
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
            <Table.Row key={installment.id} gridColumns={10}>
              <Table.Cell label={installment.dueDate} />
              <Table.Cell
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
                label={
                  installment.paymentMethod
                    ? PaymentMethodPayableText[installment.paymentMethod]
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
