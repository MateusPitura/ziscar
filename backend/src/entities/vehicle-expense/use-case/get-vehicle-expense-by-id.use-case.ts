import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseCategory } from '@shared/enums';
import { VehicleExpenseResponseDto } from '../dtos';
import { VehicleExpenseService } from '../vehicle-expense.service';

@Injectable()
export class GetVehicleExpenseByIdUseCase {
  constructor(private readonly vehicleExpenseService: VehicleExpenseService) {}

  async execute(
    expenseId: string,
    enterpriseId: number,
  ): Promise<VehicleExpenseResponseDto> {
    const expenseResult =
      await this.vehicleExpenseService.getVehicleExpenseById(
        expenseId,
        enterpriseId,
      );

    if (!expenseResult) throw new NotFoundException('Expense not found');

    const totalValue =
      expenseResult.accountPayable?.accountPayableInstallments?.reduce(
        (sum, installment: { value: number }) => sum + installment.value,
        0,
      ) || 0;

    return {
      ...expenseResult,
      category: expenseResult.category as ExpenseCategory,
      totalValue,
    };
  }
}
