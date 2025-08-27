import Table from "@/design-system/Table";
import useDialog from "@/domains/global/hooks/useDialog";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { DisableVehicleExpense } from "../types";
import { FetchVehicleExpense } from "@/domains/global/types/model";
import { ExpenseCategory } from "@shared/enums";
import DisableVehicleExpenseModal from "./DisableVehicleExpenseModal";
import VehicleExpenseTableActions from "./VehicleExpenseTableActions";
import { ExpenseCategoryText } from "../constants";
import selectVehicleExpensesInfo from "../utils/selectVehicleExpensesInfo";
import DataField from "@/domains/global/components/DataField";
import { applyMask } from "@/domains/global/utils/applyMask";
import { BLANK } from "@/domains/global/constants";
// import { useParams } from "react-router-dom";
// import { BACKEND_URL } from "@/domains/global/constants";
// import useSafeFetch from "@/domains/global/hooks/useSafeFetch";

export default function VehicleExpenseTable(): ReactNode {
  const [disableVehicleExpenseInfo, setDisableVehicleExpenseInfo] =
    useState<DisableVehicleExpense>({
      vehicleExpenseId: "",
      vehicleCategory: "",
    });

  const dialog = useDialog();
  //   const { safeFetch } = useSafeFetch();
  // const { vehicleId } = useParams();

  function handleDisableVehicleExpenseInfo(
    vehicleExpense: DisableVehicleExpense
  ) {
    dialog.openDialog();
    setDisableVehicleExpenseInfo(vehicleExpense);
  }

  async function getVehicleExpenseInfo(): Promise<FetchVehicleExpense[]> {
    // return await safeFetch(`${BACKEND_URL}/vehicle-expense/${vehicleId}`, { // 🌠 MOCK
    //   resource: "VEHICLE_EXPENSE",
    //   action: "READ",
    // });

    return [
      {
        id: 1,
        category: ExpenseCategory.MAINTENANCE,
        observations: "Troca de óleo",
        archivedAt: undefined,
        totalValue: "1500",
        competencyDate: "2023-10-01",
      },
      {
        id: 2,
        category: ExpenseCategory.FUEL,
        observations: "Abastecimento",
        archivedAt: undefined,
        totalValue: "300",
        competencyDate: "2023-10-05",
      },
      {
        id: 3,
        category: ExpenseCategory.INSURANCE,
        observations: "Seguro anual",
        archivedAt: undefined,
        totalValue: "1200",
        competencyDate: "2023-10-10",
      },
    ];
  }

  const {
    data: vehicleExpensesInfo,
    isFetching: isFetchingVehicleExpensesInfo,
  } = useQuery({
    queryKey: ["vehicle-expenses"],
    queryFn: getVehicleExpenseInfo,
    select: selectVehicleExpensesInfo,
  });

  const biggestValueLength = useMemo(() => {
    if (!vehicleExpensesInfo?.length) return 0;
    return Math.max(...vehicleExpensesInfo.map((v) => v.totalValue.length));
  }, [vehicleExpensesInfo]);

  return (
    <>
      <DisableVehicleExpenseModal {...disableVehicleExpenseInfo} {...dialog} />
      <div className="w-fit">
        <DataField
          label="Total de gastos"
          value={applyMask("1000000", "money")}
        />
      </div>
      <Table>
        <Table.Header gridColumns={8}>
          <Table.Head label="Data de competência" />
          <Table.Head label="Observações" />
          <Table.Head label="Categoria" />
          <Table.Head label="Valor" colSpan={1} />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingVehicleExpensesInfo}
          isEmpty={!vehicleExpensesInfo?.length}
          resource="VEHICLE_EXPENSE"
          action="READ"
        >
          {vehicleExpensesInfo?.map((expense) => (
            <Table.Row key={expense.id} gridColumns={8}>
              <Table.Cell label={expense.competencyDate} />
              <Table.Cell label={expense.observations} />
              <Table.Cell label={ExpenseCategoryText[expense.category]} />
              <Table.Cell
                label={expense.totalValue.padStart(biggestValueLength, BLANK)}
                className="font-mono whitespace-pre"
                colSpan={1}
              />
              <Table.Action>
                <VehicleExpenseTableActions
                  vehicleExpenseId={String(expense.id)}
                  vehicleCategory={ExpenseCategoryText[expense.category]}
                  handleDisableVehicleExpenseInfo={
                    handleDisableVehicleExpenseInfo
                  }
                  isActive={!expense.archivedAt}
                />
              </Table.Action>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}
