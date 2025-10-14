import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import formatInstallment from "@/domains/global/utils/formatInstallment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleDefaultValues } from "../constants";
import { SchemaVehicleForm } from "../schemas";
import { VehicleFormInputs } from "../types";
import VehicleTabs from "./VehicleTabs";

export default function NewVehiclePage({
  contextHelper,
}: ContextHelperable): ReactNode {
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

    const installments = formatInstallment({
      installment: payment.installment!,
      upfront: payment.upfront,
    });

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
      queryClient.invalidateQueries({ queryKey: ["accounts-payable"] });
    },
  });

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
  }

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form<VehicleFormInputs>
        onSubmit={mutate}
        className="flex-1 flex flex-col gap-4"
        schema={SchemaVehicleForm}
        defaultValues={vehicleDefaultValues}
      >
        <PageHeader title="Cadastrar veículo" contextHelper={contextHelper} />
        <VehicleTabs />
        <PageFooter dirty primaryBtnState={isPending ? "loading" : undefined}>
          <Button
            color="lightBlue"
            iconRight="Save"
            label="Salvar"
            tooltipMessage="Salvar cadastro"
          />
          <Button
            color="red"
            iconRight="Close"
            label="Cancelar"
            tooltipMessage="Cancelar cadastro"
            onClick={() => navigate("/vehicles")}
          />
        </PageFooter>
      </Form>
    </div>
  );
}
