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
    id: string,
    data: UpdateVehicleRequestDto,
  ): Promise<UpdateVehicleResponseDto> {
    return await this.vehicleRepository.update(id, data);
  }
}
