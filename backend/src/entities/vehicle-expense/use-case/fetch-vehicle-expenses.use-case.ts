import { Injectable } from '@nestjs/common';
import { ExpenseCategory } from '@shared/enums';
import { VehicleExpenseResponseDto } from '../dtos';
import { VehicleExpenseService } from '../vehicle-expense.service';

@Injectable()
export class FetchVehicleExpensesUseCase {
  constructor(private readonly vehicleExpenseService: VehicleExpenseService) {}

  async execute(vehicleId: string): Promise<VehicleExpenseResponseDto[]> {
    const expensesResult =
      await this.vehicleExpenseService.fetchVehicleExpenses(vehicleId);

    if (!expensesResult.length) return [];

    return expensesResult.map((expense) => {
      const totalValue =
        expense.accountPayable?.accountPayableInstallments?.reduce(
          (sum: number, installment: { value: number }) =>
            sum + installment.value,
          0,
        ) || 0;

      return {
        ...expense,
        category: expense.category as ExpenseCategory,
        totalValue,
      };
    });
  }
}
