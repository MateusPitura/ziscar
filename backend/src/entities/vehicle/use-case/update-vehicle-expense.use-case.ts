import { Injectable } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import { UpdateVehicleExpenseRequestDto, VehicleExpenseResponseDto } from '../dtos';
import { ExpenseCategory } from '@shared/enums';

@Injectable()
export class UpdateVehicleExpenseUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  async execute(
    expenseId: string,
    input: UpdateVehicleExpenseRequestDto,
  ): Promise<VehicleExpenseResponseDto> {
    const updatedExpense =  await this.vehicleService.updateVehicleExpense(expenseId, input);

    return {...updatedExpense, category: updatedExpense.category as ExpenseCategory}
  }
}
