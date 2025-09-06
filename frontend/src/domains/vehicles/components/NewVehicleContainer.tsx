import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { InstallmentStatus } from "@shared/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleDefaultValues } from "../constants";
import { SchemaVehicleForm } from "../schemas";
import { VehicleFormInputs } from "../types";
import VehicleTabs from "./VehicleTabs";

export default function NewVehicleContainer(): ReactNode {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function createVehicle({
    vehicle,
    characteristics,
    payment,
  }: VehicleFormInputs) {
    const characteristicsFormatted = [
      ...characteristics.commonCharacteristics,
      ...characteristics.newCharacteristics.map((c) => c.description),
    ];

    const installments = [
      {
        installmentSequence: 2, // 🌠 FIX INSTALLMENT SEQUENCE
        dueDate: payment.installment?.dueDate,
        value: payment.installment?.value,
        isUpfront: false,
        paymentMethods:
          payment.installment?.status === InstallmentStatus.PAID
            ? [
                {
                  type: payment.installment?.paymentMethod,
                  value: payment.installment?.value,
                  paymentDate: payment.installment?.paymentDate,
                },
              ]
            : null,
      },
    ];

    if (payment.upfront.length) {
      installments.push({
        installmentSequence: 1, // 🌠 FIX INSTALLMENT SEQUENCE
        dueDate: payment.upfront[0]?.dueDate,
        value: payment.upfront[0]?.value,
        isUpfront: true,
        paymentMethods:
          payment.upfront[0]?.status === InstallmentStatus.PAID
            ? [
                {
                  type: payment.upfront[0]?.paymentMethod,
                  value: payment.upfront[0]?.value,
                  paymentDate: payment.upfront[0]?.paymentDate,
                },
              ]
            : null,
      });
    }

    await safeFetch(`${BACKEND_URL}/vehicles`, {
      method: "POST",
      body: {
        ...vehicle,
        characteristics: characteristicsFormatted,
        payment: {
          purchaseDate: payment.purchaseDate,
          paidTo: payment.paidTo,
          installments,
        },
      },
      resource: "VEHICLES",
      action: "CREATE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Veículo criado com sucesso",
      });
      navigate("/vehicles");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["accounts-receivable"] });
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<VehicleFormInputs>
        onSubmit={mutate}
        className="flex-1 flex flex-col gap-4"
        schema={SchemaVehicleForm}
        defaultValues={vehicleDefaultValues}
      >
        <PageHeader title="Cadastrar veículo" />
        <VehicleTabs />
        <PageFooter dirty primaryBtnState={isPending ? "loading" : undefined}>
          <Button color="lightBlue" iconRight="Save" label="Salvar" />
          <Button
            color="red"
            iconRight="Close"
            label="Cancelar"
            onClick={() => navigate("/vehicles")}
          />
        </PageFooter>
      </Form>
    </div>
  );
}
