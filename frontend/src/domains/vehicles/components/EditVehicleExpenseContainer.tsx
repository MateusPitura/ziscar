import Spinner from "@/design-system/Spinner";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { VehicleExpense } from "@/domains/global/types/model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ExpenseCategoryText } from "../constants";
import ExpenseForm from "../forms/ExpenseForm";
import { VehicleExpenseFormInputs } from "../types";
import selectVehicleExpenseInfo from "../utils/selectVehicleExpenseInfo";

export default function EditVehicleExpenseContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { expenseId } = useParams();
  const { pathname } = useLocation();

  async function getVehicleExpense(): Promise<VehicleExpense> {
    return await safeFetch(
      `${BACKEND_URL}/vehicle-expense/detail/${expenseId}`,
      {
        // 🌠 IMPROVE
        resource: "VEHICLE_EXPENSE",
        action: "READ",
      }
    );
  }

  const { data: vehicleExpenseData, isFetching } = useQuery({
    queryKey: ["vehicle-expense", expenseId],
    queryFn: getVehicleExpense,
    select: selectVehicleExpenseInfo,
  });

  async function editVehicleExpense(data: VehicleExpenseFormInputs) {
    await safeFetch(`${BACKEND_URL}/vehicle-expense/${expenseId}`, {
      method: "PATCH",
      body: data.payment,
      resource: "VEHICLE_EXPENSE",
      action: "UPDATE",
    });
  }

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editVehicleExpense,
    onSuccess: async () => {
      if (vehicleExpenseData?.payment.category) {
        showSuccessSnackbar({
          title: `Gasto de ${
            ExpenseCategoryText[vehicleExpenseData.payment.category]
          } atualizado com sucesso`,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["vehicle-expenses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts-payable"],
      });
      navigate(pathname.replace(`/edit/${expenseId}`, ""));
    },
  });

  useEffect(
    () => () => {
      if (isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["vehicle-expense", expenseId],
        });
      }
    },
    [isSuccess, queryClient, expenseId]
  );

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  return (
    vehicleExpenseData && (
      <ExpenseForm
        defaultValues={vehicleExpenseData}
        onSubmit={mutate}
        isPending={isPending}
        headerTitle="Alterar Gasto do Veículo"
        isEdit
        resource="VEHICLE_EXPENSE"
        action="UPDATE"
        onClose={() => navigate(pathname.replace(`/edit/${expenseId}`, ""))}
      />
    )
  );
}
