import { DialogProps } from "@/domains/global/types";
import type { ReactNode } from "react";
import Dialog from "@/design-system/Dialog";
import { useQuery } from "@tanstack/react-query";
import {
  AccountReceivableInstallment,
  PaymentMethod,
} from "@/domains/global/types/model";
import DataField from "@/domains/global/components/DataField";
import Spinner from "@/design-system/Spinner";
import selectPaymentMethodInfo from "../utils/selectPaymentMethodInfo";
import { PaymentMethodText } from "../constants";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
// import { BACKEND_URL } from "@/domains/global/constants";

interface ViewPaymentMethodModalProperties extends DialogProps {
  installment: AccountReceivableInstallment;
}

export default function ViewPaymentMethodModal({
  installment,
  ...dialog
}: ViewPaymentMethodModalProperties): ReactNode {
  // const { safeFetch } = useSafeFetch();

  async function getPaymentMethod(): Promise<PaymentMethod> {
    // return await safeFetch(
    //   `${BACKEND_URL}/accounts-receivable-installments/payment-method/${installment?.id}`,
    //   {
    //     resource: "ACCOUNTS_RECEIVABLE",
    //     action: "READ",
    //   }
    // );
    return {
      id: 1,
      paymentDate: "2025-01-01",
      type: "CREDIT_CARD",
    };
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
                  PaymentMethodText[paymentMethodData?.type]
                }
              />
            </>
          )}
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
