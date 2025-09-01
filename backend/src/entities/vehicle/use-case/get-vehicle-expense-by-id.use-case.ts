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
    const expenseResult =  await this.vehicleRepository.fetchVehicleExpenseById(expenseId);

    if(!expenseResult) throw new NotFoundException('Expense not found')

    return {...expenseResult,
      category: expenseResult.category as ExpenseCategory
    }
  }
}
