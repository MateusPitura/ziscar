import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ExpenseCategoryText, vehicleExpenseDefaultValues } from "../constants";
import ExpenseForm from "../forms/ExpenseForm";
import { VehicleExpenseFormInputs } from "../types";
import { InstallmentStatus } from "@shared/enums";

export default function NewVehicleExpenseContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccessSnackbar } = useSnackbar();
  const { pathname } = useLocation();
  const { vehicleId } = useParams();

  async function createExpense({ payment }: VehicleExpenseFormInputs) {
    await safeFetch(`${BACKEND_URL}/vehicles/expense`, {
      // 🌠 IMPROVE
      method: "POST",
      body: {
        vehicleId,
        category: payment.category,
        observations: payment.observations,
        description: `Gasto Veículo ${vehicleId}`, // 🌠 Pegar a placa do veículo
        paidTo: ExpenseCategoryText[payment.category],
        installments: [
          {
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
        ],
      },
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
