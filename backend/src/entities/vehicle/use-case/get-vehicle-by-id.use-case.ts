import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleCategory, VehicleStatus } from '@shared/enums';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleWithPaymentResponseDto } from '../dtos';

@Injectable()
export class GetVehicleByIdUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    vehicleId: string,
  ): Promise<VehicleWithPaymentResponseDto> {
    const vehicleResult =  await this.vehicleRepository.getVehicleWithPayment(vehicleId);

    if(!vehicleResult) throw new NotFoundException('Vehicle not found');

    return {
      ...vehicleResult,
      category: vehicleResult.category as VehicleCategory,
      status: vehicleResult.status as VehicleStatus
    }
  }
}
