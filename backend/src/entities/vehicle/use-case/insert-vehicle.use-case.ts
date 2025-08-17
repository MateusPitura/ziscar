import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { InsertVehicleRequestDto, InsertVehicleResponseDto } from '../dtos';

@Injectable()
export class InsertVehicleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    input: InsertVehicleRequestDto,
  ): Promise<InsertVehicleResponseDto> {
    const { characteristics, ...vehicleInputData } = input;
    const { id } = await this.vehicleRepository.create(vehicleInputData);

    if (characteristics?.length) {
      await this.vehicleRepository.insertCharacteristics(id, characteristics);
    }

    return { id };
  }
}
