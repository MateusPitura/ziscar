import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import Spinner from "@/design-system/Spinner";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { VehicleWithPayment } from "@/domains/global/types/model";
import { FuelType, VehicleCategory, VehicleStatus } from "@shared/enums";
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
    // return await safeFetch(`${BACKEND_URL}/vehicle/${vehicleId}`, { // 🌠 MOCK
    //   resource: "VEHICLES",
    //   action: "READ",
    // });

    return {
      payment: {
        purchaseDate: "2023-01-01",
        paidTo: "Fulano de Tal",
      },
      vehicle: {
        id: 1,
        modelName: "Fusca",
        announcedPrice: 8000000,
        plateNumber: "ABC1234",
        modelYear: 1970,
        status: VehicleStatus.DELIVERED,
        archivedAt: undefined,
        brand: {
          id: 10,
          name: "Volkswagen",
        },
        store: {
          id: 1,
          name: "Loja 1",
        },
        category: VehicleCategory.CAR,
        color: "#FFFFFF",
        chassiNumber: "AAAAAAAAAAAAAAAAA",
        commissionValue: 1000,
        fuelType: FuelType.FLEX,
        kilometers: 1000,
        minimumPrice: 8000000,
        yearOfManufacture: 1970,
        characteristics: [
          "Direção hidráulica",
          "Janelas elétricas",
          "Ar condicionado",
          "Piloto automático",
          "Vidros elétricos",
          "Freios ABS",
        ],
      },
    };
  }

  const { data: vehicleData, isFetching } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: getVehicle,
    select: selectVehicleInfo,
  });

  async function editVehicle(data: VehicleFormInputs) {
    await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}`, {
      // 🌠 IMPROVE
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
          defaultValues={vehicleData}
        >
          <PageHeader title="Alterar veículo" />
          <VehicleTabs isEdit />
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
