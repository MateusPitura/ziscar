import { Injectable, NotFoundException } from '@nestjs/common';
import { UnarchiveVehicleExpenseResponseDto } from '../dtos';
import { VehicleExpenseService } from '../vehicle-expense.service';

@Injectable()
export class UnarchiveVehicleExpenseUseCase {
  constructor(private readonly vehicleExpenseService: VehicleExpenseService) {}

  async execute(
    expenseId: string,
    enterpriseId: number,
  ): Promise<UnarchiveVehicleExpenseResponseDto> {
    const expense = await this.vehicleExpenseService.getVehicleExpenseById(
      expenseId,
      enterpriseId,
    );

    if (!expense) {
      throw new NotFoundException('Vehicle expense not found');
    }

    if (!expense.archivedAt) {
      throw new Error('Vehicle expense is not archived');
    }

    const unarchivedExpense =
      await this.vehicleExpenseService.unarchiveVehicleExpense(expenseId);

    return {
      id: unarchivedExpense.id,
      archivedAt: unarchivedExpense.archivedAt,
    };
  }
}
