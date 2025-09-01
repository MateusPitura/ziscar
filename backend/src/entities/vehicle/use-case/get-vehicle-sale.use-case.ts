import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleSaleResponseDto } from '../dtos';

@Injectable()
export class GetVehicleSaleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(vehicleSaleId: string): Promise<VehicleSaleResponseDto> {
    const saleResult =  await this.vehicleRepository.getVehicleSale(vehicleSaleId);

    if(!saleResult) throw new NotFoundException('Vehicle sale not found')

    return saleResult
  }
}
