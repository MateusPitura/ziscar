import { Inject, Injectable } from '@nestjs/common';
import type { FetchVehicleBrandsResponseDto } from '../dtos';
import { VehicleRepository } from 'src/repositories/vehicle-repository';

@Injectable()
export class FetchBrandsUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(): Promise<FetchVehicleBrandsResponseDto> {
    return await this.vehicleRepository.fetchBrands();
  }
}
