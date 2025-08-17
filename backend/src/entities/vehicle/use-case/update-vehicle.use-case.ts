import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { UpdateVehicleRequestDto, UpdateVehicleResponseDto } from '../dtos';

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
    const { characteristics, ...vehicleData } = data;

    const updatedVehicle = await this.vehicleRepository.update(id, vehicleData);

    if (characteristics) {
      await this.vehicleRepository.updateCharacteristics(
        updatedVehicle.id,
        characteristics,
      );
    }

    return updatedVehicle;
  }
}
