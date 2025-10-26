import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { VehicleSaleResponseDto } from '../dtos';

@Injectable()
export class GetVehicleSaleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    vehicleSaleId: string,
    enterpriseId: number,
  ): Promise<VehicleSaleResponseDto> {
    const saleResult = await this.vehicleRepository.getVehicleSale(
      vehicleSaleId,
      enterpriseId,
    );

    if (!saleResult) throw new NotFoundException('Vehicle sale not found');

    return {
      ...saleResult,
      vehicleSnapshot: saleResult.vehicleSnapshot as Record<
        string,
        unknown
      > | null,
      customerSnapshot: saleResult.customerSnapshot as Record<
        string,
        unknown
      > | null,
    };
  }
}
