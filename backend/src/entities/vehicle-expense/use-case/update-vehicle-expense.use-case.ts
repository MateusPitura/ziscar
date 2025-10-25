import { Injectable } from '@nestjs/common';
import { ExpenseCategory } from '@shared/enums';
import {
  UpdateVehicleExpenseRequestDto,
  VehicleExpenseResponseDto,
} from '../dtos';
import { VehicleExpenseService } from '../vehicle-expense.service';

@Injectable()
export class UpdateVehicleExpenseUseCase {
  constructor(private readonly vehicleExpenseService: VehicleExpenseService) {}

  async execute(
    expenseId: string,
    input: UpdateVehicleExpenseRequestDto,
    enterpriseId: number,
  ): Promise<VehicleExpenseResponseDto> {
    await this.vehicleExpenseService.updateVehicleExpense(expenseId, input);

    const updatedExpense =
      await this.vehicleExpenseService.getVehicleExpenseById(
        expenseId,
        enterpriseId,
      );

    if (!updatedExpense) throw new Error('Expense not found after update');

    const totalValue =
      updatedExpense.accountPayable?.accountPayableInstallments?.reduce(
        (sum, installment: { value: number }) => sum + installment.value,
        0,
      ) || 0;

    return {
      ...updatedExpense,
      category: updatedExpense.category as ExpenseCategory,
      totalValue,
    };
  }
}
