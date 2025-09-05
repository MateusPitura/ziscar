import { Injectable, NotFoundException } from '@nestjs/common';
import { ArchiveVehicleExpenseResponseDto } from '../dtos';
import { VehicleExpenseService } from '../vehicle-expense.service';

@Injectable()
export class ArchiveVehicleExpenseUseCase {
  constructor(private readonly vehicleExpenseService: VehicleExpenseService) {}

  async execute(expenseId: string): Promise<ArchiveVehicleExpenseResponseDto> {
    const expense =
      await this.vehicleExpenseService.getVehicleExpenseById(expenseId);
    if (!expense) {
      throw new NotFoundException('Vehicle expense not found');
    }

    if (expense.archivedAt) {
      throw new Error('Vehicle expense is already archived');
    }

    const archivedExpense =
      await this.vehicleExpenseService.archiveVehicleExpense(expenseId);

    return {
      id: archivedExpense.id,
      archivedAt: archivedExpense.archivedAt!,
    };
  }
}
