import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleExpenseResponseDto } from '../dtos';
import { ExpenseCategory } from '@shared/enums';

@Injectable()
export class getVehicleExpenseByIdUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(expenseId: string): Promise<VehicleExpenseResponseDto> {
    const expenseResult =
      await this.vehicleRepository.getVehicleExpenseById(expenseId);

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
