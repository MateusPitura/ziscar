import Dialog from "@/design-system/Dialog";
import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import InputLabel from "@/design-system/Form/InputLabel";
import {
  BACKEND_URL,
  PaymentMethodReceivableText,
} from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { DialogProps } from "@/domains/global/types";
import { AccountReceivableInstallment } from "@/domains/global/types/model";
import { PaymentMethodReceivableType } from "@shared/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { paymentMethodDefaultValues } from "../constants";
import { SchemaPaymentMethodForm } from "../schemas";
import { PaymentMethodFormInputs } from "../types";

interface AddPaymentMethodModalProperties extends DialogProps {
  installment: AccountReceivableInstallment;
}

export default function AddPaymentMethodModal({
  installment,
  ...dialog
}: AddPaymentMethodModalProperties): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function createPaymentMethod(
    data: PaymentMethodFormInputs
  ): Promise<void> {
    await safeFetch(
      `${BACKEND_URL}/account-receivable-installments/payment-method/${installment.id}`,
      {
        method: "POST",
        body: data,
        resource: "ACCOUNTS_RECEIVABLE",
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
        queryKey: ["accounts-receivable-installments", String(installment.id)],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "accounts-receivable-payment-method",
          String(installment.id),
        ],
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
            label="Data do pagamento"
            required
            type="date"
          />
          <InputLabel label="Forma de pagamento" required />
          <div className="flex flex-col gap-2">
            <Choice required>
              {Object.values(PaymentMethodReceivableType).map((type) => (
                <Choice.Radio<PaymentMethodFormInputs>
                  key={type}
                  label={PaymentMethodReceivableText[type]}
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
            primaryBtnResource="ACCOUNTS_RECEIVABLE"
            primaryBtnAction="CREATE"
          />
        </Form>
      </Dialog.Body>
    </Dialog>
  );
}
