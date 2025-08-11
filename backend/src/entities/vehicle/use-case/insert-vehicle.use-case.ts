import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import type {
  InsertVehicleRequestDto,
  InsertVehicleResponseDto,
} from '../dtos';

@Injectable()
export class InsertVehicleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    input: InsertVehicleRequestDto,
  ): Promise<InsertVehicleResponseDto> {
    const createdVehicle = await this.vehicleRepository.create(input);

    return { id: createdVehicle.id };
  }
}
