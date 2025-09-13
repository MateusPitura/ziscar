import Dialog from "@/design-system/Dialog";
import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import InputLabel from "@/design-system/Form/InputLabel";
import {
    BACKEND_URL,
    PaymentMethodPayableText,
} from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { DialogProps } from "@/domains/global/types";
import { AccountPayableInstallment } from "@/domains/global/types/model";
import { PaymentMethodPayableType } from "@shared/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { paymentMethodDefaultValues } from "../constants";
import { SchemaPaymentMethodForm } from "../schemas";
import { PaymentMethodFormInputs } from "../types";

interface AddPaymentMethodModalProperties extends DialogProps {
  installment: AccountPayableInstallment;
}

export default function AddPaymentMethodModal({
  installment,
  ...dialog
}: AddPaymentMethodModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { accountPayableId } = useParams();

  async function createPaymentMethod(
    data: PaymentMethodFormInputs
  ): Promise<void> {
    await safeFetch(
      `${BACKEND_URL}/account-payable-installments/payment-method/${installment.id}`,
      {
        method: "POST",
        body: data,
        resource: "ACCOUNTS_PAYABLE",
        action: "CREATE",
      }
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Método de pagamento adicionado",
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts-payable-installments", accountPayableId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "accounts-payable-payment-method",
          String(installment.id),
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts-payable"],
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
            label="Data do pagamento"
            required
            type="date"
          />
          <InputLabel label="Forma de pagamento" required />
          <div className="flex flex-col gap-2">
            <Choice required>
              {Object.values(PaymentMethodPayableType).map((type) => (
                <Choice.Radio<PaymentMethodFormInputs>
                  key={type}
                  label={PaymentMethodPayableText[type]}
                  name="type"
                  value={type}
                />
              ))}
            </Choice>
          </div>
          <Dialog.Footer
            labelPrimaryBtn="Adicionar"
            className="px-0"
            dirty={false}
            primaryBtnState={isPending ? "loading" : undefined}
            primaryBtnResource="ACCOUNTS_PAYABLE"
            primaryBtnAction="CREATE"
          />
        </Form>
      </Dialog.Body>
    </Dialog>
  );
}
