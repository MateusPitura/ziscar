import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { vehicleExpenseDefaultValues } from "../constants";
import ExpenseForm from "../forms/ExpenseForm";
import { VehicleExpenseFormInputs } from "../types";

export default function NewVehicleExpenseContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccessSnackbar } = useSnackbar();
  const { pathname } = useLocation();

  async function createExpense(data: VehicleExpenseFormInputs) {
    console.log(data);
    await safeFetch(`${BACKEND_URL}/vehicle-expense`, {
      method: "POST",
      body: data,
      resource: "VEHICLE_EXPENSE",
      action: "CREATE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Gasto criado com sucesso",
      });
      navigate(pathname.replace("/new", ""));
      queryClient.invalidateQueries({ queryKey: ["vehicle-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["accounts-payable"] });
    },
  });

  return (
    <ExpenseForm
      defaultValues={vehicleExpenseDefaultValues}
      onSubmit={mutate}
      isPending={isPending}
      headerTitle="Novo gasto"
      resource="VEHICLE_EXPENSE"
      action="CREATE"
      onClose={() => navigate(pathname.replace("/new", ""))}
    />
  );
}
