import Dialog from "@/design-system/Dialog";
import Spinner from "@/design-system/Spinner";
import DataField from "@/domains/global/components/DataField";
import {
  BACKEND_URL,
  PaymentMethodReceivableText,
} from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { DialogProps } from "@/domains/global/types";
import {
  AccountReceivableInstallment,
  PaymentMethod,
} from "@/domains/global/types/model";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import selectPaymentMethodInfo from "../utils/selectPaymentMethodInfo";

interface ViewPaymentMethodModalProperties extends DialogProps {
  installment: AccountReceivableInstallment;
}

export default function ViewPaymentMethodModal({
  installment,
  ...dialog
}: ViewPaymentMethodModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();

  async function getPaymentMethod(): Promise<PaymentMethod> {
    const result = await safeFetch(
      `${BACKEND_URL}/account-receivable-installments/payment-method/${installment?.id}`,
      {
        resource: "ACCOUNTS_RECEIVABLE",
        action: "READ",
      }
    );

    return result?.paymentMethodReceivables?.[0];
  }

  const { data: paymentMethodData, isFetching } = useQuery({
    queryKey: ["accounts-receivable-payment-method", installment.id],
    queryFn: getPaymentMethod,
    select: selectPaymentMethodInfo,
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Detalhes do Método de Pagamento" />
      <Dialog.Body>
        <div className="flex flex-col gap-4 h-36 mb-8">
          {isFetching ? (
            <div className="flex justify-center items-center h-full w-full">
              <Spinner />
            </div>
          ) : (
            <>
              <DataField
                label="Data do pagamento"
                value={paymentMethodData?.paymentDate}
              />
              <DataField
                label="Forma de pagamento"
                value={
                  paymentMethodData &&
                  PaymentMethodReceivableText[paymentMethodData?.type]
                }
              />
            </>
          )}
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
