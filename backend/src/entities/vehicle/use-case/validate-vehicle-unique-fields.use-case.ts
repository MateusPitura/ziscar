import { ConflictException, Injectable } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';

interface ValidateVehicleUniqueFieldsUseCaseInput {
  chassiNumber?: string;
  plateNumber?: string;
  vehicleId?: number;
}

@Injectable()
export class ValidateVehicleUniqueFieldsUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  async execute({
    chassiNumber,
    plateNumber,
    vehicleId,
  }: ValidateVehicleUniqueFieldsUseCaseInput): Promise<void> {
    if (chassiNumber) {
      const existingChassi =
        await this.vehicleService.findByChassiNumber(chassiNumber);
      if (existingChassi && existingChassi.id !== vehicleId) {
        throw new ConflictException('Já existe um veículo com este chassi');
      }
    }

    if (plateNumber) {
      const existingPlate =
        await this.vehicleService.findByPlateNumber(plateNumber);
      if (existingPlate && existingPlate.id !== vehicleId) {
        throw new ConflictException('Já existe um veículo com esta placa');
      }
    }
  }
}
