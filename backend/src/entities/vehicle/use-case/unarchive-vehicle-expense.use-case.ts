import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import { UnarchiveVehicleExpenseResponseDto } from '../dtos';

@Injectable()
export class UnarchiveVehicleExpenseUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  async execute(
    expenseId: string,
  ): Promise<UnarchiveVehicleExpenseResponseDto> {
    const expense = await this.vehicleService.getVehicleExpenseById(expenseId);
    if (!expense) {
      throw new NotFoundException('Vehicle expense not found');
    }

    if (!expense.archivedAt) {
      throw new Error('Vehicle expense is not archived');
    }

    const unarchivedExpense =
      await this.vehicleService.unarchiveVehicleExpense(expenseId);

    return {
      id: unarchivedExpense.id,
      archivedAt: unarchivedExpense.archivedAt,
    };
  }
}
