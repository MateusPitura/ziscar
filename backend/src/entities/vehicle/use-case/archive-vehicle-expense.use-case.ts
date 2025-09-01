import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import { ArchiveVehicleExpenseResponseDto } from '../dtos';

@Injectable()
export class ArchiveVehicleExpenseUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  async execute(expenseId: string): Promise<ArchiveVehicleExpenseResponseDto> {
    const expense = await this.vehicleService.fetchVehicleExpenseById(expenseId);
    if (!expense) {
      throw new NotFoundException('Vehicle expense not found');
    }

    if (expense.archivedAt) {
      throw new Error('Vehicle expense is already archived');
    }

    const archivedExpense = await this.vehicleService.archiveVehicleExpense(expenseId);

    return {
      id: archivedExpense.id,
      archivedAt: archivedExpense.archivedAt!,
    };
  }
}
