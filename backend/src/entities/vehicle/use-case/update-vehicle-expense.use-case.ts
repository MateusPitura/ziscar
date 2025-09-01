import { Injectable } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import {
  UpdateVehicleExpenseRequestDto,
  VehicleExpenseResponseDto,
} from '../dtos';
import { ExpenseCategory } from '@shared/enums';

@Injectable()
export class UpdateVehicleExpenseUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  async execute(
    expenseId: string,
    input: UpdateVehicleExpenseRequestDto,
  ): Promise<VehicleExpenseResponseDto> {
    await this.vehicleService.updateVehicleExpense(expenseId, input);

    const updatedExpense =
      await this.vehicleService.getVehicleExpenseById(expenseId);

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
