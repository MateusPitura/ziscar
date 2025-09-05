import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { UpdateVehicleRequestDto, UpdateVehicleResponseDto } from '../dtos';
import { FuelType, VehicleCategory, VehicleStatus } from '@shared/enums';

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
    const { characteristics, payment, ...vehicleData } = data;

    if (vehicleData) await this.vehicleRepository.update(id, vehicleData);

    if (characteristics) {
      await this.vehicleRepository.updateCharacteristics(
        Number(id),
        characteristics,
      );
    }

    if (payment) {
      await this.vehicleRepository.updateVehiclePayment(id, payment);
    }

    const updatedVehicle = await this.vehicleRepository.findById(Number(id));

    return {
      ...updatedVehicle!,
      category: updatedVehicle!.category as VehicleCategory,
      status: updatedVehicle!.status as VehicleStatus,
      fuelType: updatedVehicle!.fuelType as FuelType | null,
    };
  }
}
