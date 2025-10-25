import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import {
  UnarchiveVehicleRequestDto,
  UnarchiveVehicleResponseDto,
} from '../dtos';

@Injectable()
export class UnarchiveVehicleUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  async execute(
    input: UnarchiveVehicleRequestDto,
    enterpriseId: number,
  ): Promise<UnarchiveVehicleResponseDto> {
    const { id } = input;

    const vehicle = await this.vehicleService.findById(id, enterpriseId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (!vehicle.archivedAt) {
      throw new Error('Vehicle is not archived');
    }

    const unarchivedVehicle = await this.vehicleService.unarchive(String(id));

    return {
      id: unarchivedVehicle.id,
      archivedAt: unarchivedVehicle.archivedAt,
    };
  }
}
