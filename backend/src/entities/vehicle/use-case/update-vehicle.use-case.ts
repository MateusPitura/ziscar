import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { UpdateVehicleRequestDto, UpdateVehicleResponseDto } from '../dtos';
import { FuelType, VehicleCategory, VehicleStatus } from '@shared/enums';
import { ValidateVehicleUniqueFieldsUseCase } from './validate-vehicle-unique-fields.use-case';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly vehicleRepository: VehicleRepository,
    private readonly validateVehicleUniqueFieldsUseCase: ValidateVehicleUniqueFieldsUseCase,
  ) {}

  async execute(
    id: string,
    data: UpdateVehicleRequestDto,
    enterpriseId: number,
  ): Promise<UpdateVehicleResponseDto> {
    const { characteristics, payment, ...vehicleData } = data;

    const vehicleBeforeUpdate = await this.vehicleRepository.findById(
      Number(id),
      enterpriseId,
    );

    if (!vehicleBeforeUpdate) {
      throw new Error('Vehicle not found');
    }

    await this.validateVehicleUniqueFieldsUseCase.execute({
      chassiNumber: vehicleData.chassiNumber,
      plateNumber: vehicleData.plateNumber,
      vehicleId: Number(id),
    });

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

    const vehicleAfterUpdate = await this.vehicleRepository.findById(
      Number(id),
      enterpriseId,
    );

    return {
      ...vehicleAfterUpdate!,
      category: vehicleAfterUpdate!.category as VehicleCategory,
      status: vehicleAfterUpdate!.status as VehicleStatus,
      fuelType: vehicleAfterUpdate!.fuelType as FuelType | null,
    };
  }
}
