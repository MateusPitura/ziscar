import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
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

  async function createVehicle(data: VehicleFormInputs) {
    await safeFetch(`${BACKEND_URL}/vehicles`, {
      // 🌠 IMPROVE CREATE VEHICLE
      method: "POST",
      body: data.vehicle,
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
