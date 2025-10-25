import { Prisma, VehicleExpense } from '@prisma/client';
import {
  VEHICLE_EXPENSE_SELECT,
  VEHICLE_EXPENSE_WITH_VEHICLE_SELECT,
} from 'src/entities/vehicle-expense/constants';
import { CreateInput, UpdateInput } from 'src/types';

export type GetVehicleExpenseByIdOutDto = Prisma.VehicleExpenseGetPayload<{
  select: typeof VEHICLE_EXPENSE_WITH_VEHICLE_SELECT;
}>;

export type GetVehicleExpensesOutDto = Prisma.VehicleExpenseGetPayload<{
  select: typeof VEHICLE_EXPENSE_SELECT;
}>;

export abstract class VehicleExpenseRepository {
  abstract create(data: CreateInput<VehicleExpense>): Promise<VehicleExpense>;
  abstract update(id: string, data: UpdateInput<VehicleExpense>): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract fetchVehicleExpenses(
    vehicleId: string,
    enterpriseId: number,
  ): Promise<GetVehicleExpensesOutDto[]>;
  abstract getVehicleExpenseById(
    expenseId: string,
    enterpriseId: number,
  ): Promise<GetVehicleExpenseByIdOutDto | null>;
  abstract updateVehicleExpense(
    expenseId: string,
    data: UpdateInput<VehicleExpense>,
  ): Promise<VehicleExpense>;
  abstract archiveVehicleExpense(expenseId: string): Promise<VehicleExpense>;
  abstract unarchiveVehicleExpense(expenseId: string): Promise<VehicleExpense>;
}
