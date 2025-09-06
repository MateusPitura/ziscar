import Button from "@/design-system/Button";
import Form from "@/design-system/Form";
import Spinner from "@/design-system/Spinner";
import PageFooter from "@/domains/global/components/PageFooter";
import PageHeader from "@/domains/global/components/PageHeader";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { VehicleWithPayment } from "@/domains/global/types/model";
import formatInstallment from "@/domains/global/utils/formatInstallment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { vehicleSaleDefaultValues } from "../constants";
import useVehicleSalePageContext from "../hooks/useVehicleSalePageContext";
import { SchemaVehicleSaleForm } from "../schemas";
import { VehicleSaleFormInputs } from "../types";
import selectVehicleInfo from "../utils/selectVehicleInfo";
import VehicleSaleTabs from "./VehicleSaleTabs";

export default function VehicleSaleContainer(): ReactNode {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { vehicleId } = useParams();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { customer: customerData } = useVehicleSalePageContext();

  async function getVehicle(): Promise<VehicleWithPayment> {
    const response = await safeFetch(`${BACKEND_URL}/vehicles/${vehicleId}`, {
      resource: "VEHICLES",
      action: "READ",
    });

    return {
      payment: null,
      vehicle: response,
    };
  }

  const { data: vehicleData, isFetching } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: getVehicle,
    select: selectVehicleInfo,
  });

  async function createSale({ payment, customer }: VehicleSaleFormInputs) {
    const installments = formatInstallment({
      installment: payment.installment,
      upfront: payment.upfront,
    })

    await safeFetch(`${BACKEND_URL}/vehicles/sale`, {
      method: "POST",
      body: {
        vehicleId,
        customerId: customer.id,
        date: payment.saleDate,
        commissionValue: payment.commissionValue,
        accountReceivable: {
          description: `Venda Veículo ${vehicleData?.plateNumber}`,
          receivedFrom: customerData?.fullName || "",
        },
        installments,
      },
      resource: "VEHICLE_SALE",
      action: "CREATE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Venda realizada com sucesso",
      });
      navigate("/vehicles");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["accounts-receivable"] });
      queryClient.invalidateQueries({ queryKey: ["accounts-payable"] });
    },
  });

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
        <Form<VehicleSaleFormInputs>
          onSubmit={mutate}
          className="flex-1 flex flex-col gap-4"
          schema={SchemaVehicleSaleForm({
            commissionValue: vehicleData.commissionValue,
            minimumPrice: vehicleData.minimumPrice,
          })}
          defaultValues={vehicleSaleDefaultValues({
            value: vehicleData.announcedPrice,
            commissionValue: vehicleData.commissionValue,
          })}
        >
          <PageHeader title="Realizar venda" />
          <VehicleSaleTabs vehicleData={vehicleData} />
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
