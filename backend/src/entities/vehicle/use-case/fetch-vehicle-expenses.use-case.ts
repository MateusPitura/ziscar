import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleExpenseResponseDto } from '../dtos';
import { ExpenseCategory } from '@shared/enums';

@Injectable()
export class FetchVehicleExpensesUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(vehicleId: string): Promise<VehicleExpenseResponseDto[]> {
    const expensesResult = await this.vehicleRepository.fetchVehicleExpenses(vehicleId);

    if (!expensesResult.length) return [];

    return expensesResult.map(expense => ({ ...expense, category: expense.category as ExpenseCategory }));
  }
}
