import { DialogProps } from "@/domains/global/types";
import type { ReactNode } from "react";
import { PaymentMethodFormInputs } from "../types";
import Dialog from "@/design-system/Dialog";
import Form from "@/design-system/Form";
import { SchemaPaymentMethodForm } from "../schema";
import { paymentMethodDefaultValues, PaymentMethodText } from "../constants";
import Input from "@/design-system/Form/Input";
import Choice from "@/design-system/Form/Choice";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountReceivableInstallment } from "@/domains/global/types/model";
import InputLabel from "@/design-system/Form/InputLabel";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
// import { BACKEND_URL } from "@/domains/global/constants";

interface AddPaymentMethodModalProperties extends DialogProps {
  installment: AccountReceivableInstallment;
}

export default function AddPaymentMethodModal({
  installment,
  ...dialog
}: AddPaymentMethodModalProperties): ReactNode {
  // const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function createPaymentMethod(
    data: PaymentMethodFormInputs
  ): Promise<void> {
    // await safeFetch(
    //   `${BACKEND_URL}/accounts-receivable-installments/payment-method/${installment.id}`,
    //   {
    //     method: "POST",
    //     body: data,
    //     resource: "ACCOUNTS_RECEIVABLE",
    //     action: "CREATE",
    //   }
    // );
    console.log("🌠 data: ", data);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Método de pagamento adicionado",
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts-receivable-installments", installment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts-receivable-payment-method", installment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts-receivable"],
      });
      dialog.closeDialog();
    },
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title="Adicionar Método de Pagamento" />
      <Dialog.Body>
        <Form<PaymentMethodFormInputs>
          schema={SchemaPaymentMethodForm}
          defaultValues={paymentMethodDefaultValues}
          onSubmit={mutate}
          className="flex flex-col gap-4"
        >
          <Input<PaymentMethodFormInputs>
            name="paymentDate"
            label="Data do pagamento" // 🌠 should be before today
            required
            type="date"
          />
          <InputLabel label="Forma de pagamento" required />
          <div className="flex flex-col gap-2">
            <Choice required>
              <Choice.Radio<PaymentMethodFormInputs>
                label={PaymentMethodText['BANK_SLIP']}
                name="type"
                value="BANK_SLIP"
              />
              <Choice.Radio<PaymentMethodFormInputs>
                label={PaymentMethodText['CREDIT_CARD']}
                name="type"
                value="CREDIT_CARD"
              />
              <Choice.Radio<PaymentMethodFormInputs>
                label={PaymentMethodText['DEBIT_CARD']}
                name="type"
                value="DEBIT_CARD"
              />
              <Choice.Radio<PaymentMethodFormInputs>
                label={PaymentMethodText['CASH']}
                name="type"
                value="CASH"
              />
              <Choice.Radio<PaymentMethodFormInputs>
                label={PaymentMethodText['DOC']}
                name="type"
                value="DOC"
              />
              <Choice.Radio<PaymentMethodFormInputs>
                label={PaymentMethodText['PIX']}
                name="type"
                value="PIX"
              />
              <Choice.Radio<PaymentMethodFormInputs>
                label={PaymentMethodText['TED']}
                name="type"
                value="TED"
              />
              <Choice.Radio<PaymentMethodFormInputs>
                label={PaymentMethodText['TRANSFER']}
                name="type"
                value="TRANSFER"
              />
            </Choice>
          </div>
          <Dialog.Footer
            labelPrimaryBtn="Adicionar"
            className="px-0"
            dirty={false}
            primaryBtnState={isPending ? "loading" : undefined}
            primaryBtnResource="ACCOUNTS_RECEIVABLE"
            primaryBtnAction="DELETE"
          />
        </Form>
      </Dialog.Body>
    </Dialog>
  );
}
