import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import Spinner from "@/design-system/Spinner";
import { ContextHelperable } from "@/domains/contextHelpers/types";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { VehicleWithPayment } from "@/domains/global/types/model";
import formatVehicleCharacteristics from "@/domains/global/utils/formatVehicleCharacteristics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SchemaVehicleForm } from "../schemas";
import { VehicleFormInputs } from "../types";
import selectVehicleInfo from "../utils/selectVehicleInfo";
import VehicleTabs from "./VehicleTabs";

export default function EditVehiclePage({
  contextHelper,
}: ContextHelperable): ReactNode {
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

    const { payment, vehicleCharacteristicValues, ...vehicle } = response;

    return {
      payment,
      vehicle: {
        ...vehicle,
        vehicleCharacteristicValues: formatVehicleCharacteristics({
          vehicleCharacteristicValues,
        }),
      },
    };
  }

  const { data: vehicleData, isFetching } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: getVehicle,
    select: selectVehicleInfo,
  });

  async function editVehicle({
    characteristics,
    payment,
    vehicle,
  }: VehicleFormInputs) {
    const characteristicsFormatted = [
      ...characteristics.commonCharacteristics,
      ...characteristics.newCharacteristics.map((c) => c.description),
    ];

    await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}`, {
      method: "PATCH",
      body: {
        ...vehicle,
        characteristics: characteristicsFormatted,
        payment: {
          purchaseDate: payment?.purchaseDate,
          paidTo: payment?.paidTo,
        },
      },
      resource: "VEHICLES",
      action: "UPDATE",
    });
  }

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editVehicle,
    onSuccess: () => {
      showSuccessSnackbar({
        title: `Veículo ${vehicleData?.vehicle.plateNumber} atualizado com sucesso`,
      });
      navigate("/vehicles");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["paid-to"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-model"] });
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
          replaceEmptyStringToNull
          defaultValues={{
            characteristics: vehicleData.characteristics,
            payment: vehicleData.payment,
            vehicle: vehicleData.vehicle,
          }}
        >
          <PageHeader title="Alterar veículo" contextHelper={contextHelper} />
          <VehicleTabs isEdit purchaseValue={vehicleData.purchaseValue} />
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
    )
  );
}
