import Table from "@/design-system/Table";
import DataField from "@/domains/global/components/DataField";
import { BACKEND_URL, BLANK } from "@/domains/global/constants";
import useDialog from "@/domains/global/hooks/useDialog";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { FetchVehicleExpense } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ExpenseCategoryText, VEHICLES_EXPENSES_TABLE } from "../constants";
import { DisableVehicleExpense } from "../types";
import selectVehicleExpensesInfo from "../utils/selectVehicleExpensesInfo";
import DisableVehicleExpenseModal from "./DisableVehicleExpenseModal";
import VehicleExpenseTableActions from "./VehicleExpenseTableActions";
import { removeMask } from "@shared/utils/removeMask";

const gridColumns = 8;

export default function VehicleExpenseTable(): ReactNode {
  const [disableVehicleExpenseInfo, setDisableVehicleExpenseInfo] =
    useState<DisableVehicleExpense>({
      vehicleExpenseId: "",
      vehicleCategory: "",
    });

  const dialog = useDialog();
  const { safeFetch } = useSafeFetch();
  const { vehicleId } = useParams();

  function handleDisableVehicleExpenseInfo(
    vehicleExpense: DisableVehicleExpense
  ) {
    dialog.openDialog();
    setDisableVehicleExpenseInfo(vehicleExpense);
  }

  async function getVehicleExpenseInfo(): Promise<FetchVehicleExpense[]> {
    return await safeFetch(`${BACKEND_URL}/vehicle-expense/${vehicleId}`, {
      resource: "VEHICLE_EXPENSE",
      action: "READ",
    });
  }

  const {
    data: vehicleExpensesInfo,
    isFetching: isFetchingVehicleExpensesInfo,
  } = useQuery({
    queryKey: ["vehicle-expenses", vehicleId],
    queryFn: getVehicleExpenseInfo,
    select: selectVehicleExpensesInfo,
  });

  const biggestValueLength = useMemo(() => {
    if (!vehicleExpensesInfo?.length) return 0;
    return Math.max(
      ...vehicleExpensesInfo.map((v) => String(v.totalValue).length)
    );
  }, [vehicleExpensesInfo]);

  const totalValueExpenses = useMemo(() => {
    if (!vehicleExpensesInfo?.length) return "0";
    let totalValue = 0;
    for (const expense of vehicleExpensesInfo) {
      if (expense.archivedAt) continue;
      totalValue += Number(removeMask(expense.totalValue));
    }
    return String(totalValue);
  }, [vehicleExpensesInfo]);

  return (
    <>
      <DisableVehicleExpenseModal {...disableVehicleExpenseInfo} {...dialog} />
      <div className="w-fit">
        <DataField
          label="Total de gastos"
          value={applyMask(totalValueExpenses, "money")}
        />
      </div>
      <Table>
        <Table.Header gridColumns={gridColumns}>
          <Table.Head label={VEHICLES_EXPENSES_TABLE.competencyDate.label} />
          <Table.Head label={VEHICLES_EXPENSES_TABLE.observations.label} />
          <Table.Head label={VEHICLES_EXPENSES_TABLE.category.label} />
          <Table.Head
            label={VEHICLES_EXPENSES_TABLE.totalValue.label}
            colSpan={VEHICLES_EXPENSES_TABLE.totalValue.colSpan}
          />
          <Table.Head action />
        </Table.Header>
        <Table.Body
          isLoading={isFetchingVehicleExpensesInfo}
          isEmpty={!vehicleExpensesInfo?.length}
          resource="VEHICLE_EXPENSE"
          action="READ"
        >
          {vehicleExpensesInfo?.map((expense) => (
            <Table.Row key={expense.id} gridColumns={gridColumns}>
              <Table.Cell
                label={expense.competencyDate}
                columnLabel={VEHICLES_EXPENSES_TABLE.competencyDate.label}
              />
              <Table.Cell
                label={expense.observations}
                columnLabel={VEHICLES_EXPENSES_TABLE.observations.label}
              />
              <Table.Cell
                label={ExpenseCategoryText[expense.category]}
                columnLabel={VEHICLES_EXPENSES_TABLE.category.label}
              />
              <Table.Cell
                label={expense.totalValue.padStart(biggestValueLength, BLANK)}
                className="font-mono whitespace-pre"
                colSpan={VEHICLES_EXPENSES_TABLE.totalValue.colSpan}
                columnLabel={VEHICLES_EXPENSES_TABLE.totalValue.label}
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
