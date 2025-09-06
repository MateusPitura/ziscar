import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import Spinner from "@/design-system/Spinner";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { VehicleWithPayment } from "@/domains/global/types/model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SchemaVehicleForm } from "../schemas";
import { VehicleFormInputs } from "../types";
import selectVehicleInfo from "../utils/selectVehicleInfo";
import VehicleTabs from "./VehicleTabs";

export default function EditVehicleContainer(): ReactNode {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { vehicleId } = useParams();

  async function getVehicle(): Promise<VehicleWithPayment> {
    const response = await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}`, {
      resource: "VEHICLES",
      action: "READ",
    });

    return {
      // 🌠 IMPROVE GET
      payment: {
        purchaseDate: "2023-01-01",
        paidTo: "Fulano de Tal",
        value: "7000000",
      },
      vehicle: response,
    };
  }

  const { data: vehicleData, isFetching } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: getVehicle,
    select: selectVehicleInfo,
  });

  async function editVehicle(data: VehicleFormInputs) {
    await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}`, {
      // 🌠 IMPROVE EDIT VEHICLE
      method: "PATCH",
      body: data.vehicle,
      resource: "VEHICLES",
      action: "UPDATE",
    });
  }

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editVehicle,
    onSuccess: () => {
      showSuccessSnackbar({
        title: `Veículo ${vehicleData?.vehicle.modelName} atualizado com sucesso`,
      });
      navigate("/vehicles");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  useEffect(
    () => () => {
      if (isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["vehicle", vehicleId],
        });
      }
    },
    [isSuccess, queryClient, vehicleId]
  );

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    vehicleData && (
      <div className="flex flex-col gap-4 w-full">
        <Form<VehicleFormInputs>
          onSubmit={mutate}
          className="flex-1 flex flex-col gap-4"
          schema={SchemaVehicleForm}
          onlyDirty
          defaultValues={{
            characteristics: vehicleData.characteristics,
            payment: vehicleData.payment,
            vehicle: vehicleData.vehicle,
          }}
        >
          <PageHeader title="Alterar veículo" />
          <VehicleTabs isEdit purchaseValue={vehicleData.purchaseValue} />
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
    )
  );
}
