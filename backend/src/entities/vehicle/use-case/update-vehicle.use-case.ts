import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import type {
  UpdateVehicleRequestDto,
  UpdateVehicleResponseDto,
} from '../dtos';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    input: UpdateVehicleRequestDto,
  ): Promise<UpdateVehicleResponseDto> {
    const { id, ...updateData } = input;

    await this.vehicleRepository.update(id.toString(), updateData);

    return { id };
  }
}
