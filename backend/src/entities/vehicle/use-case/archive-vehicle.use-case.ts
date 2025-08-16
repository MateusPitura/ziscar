import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleService } from '../vehicle.service';
import type {
  ArchiveVehicleRequestDto,
  ArchiveVehicleResponseDto,
} from '../dtos';

@Injectable()
export class ArchiveVehicleUseCase {
  constructor(private readonly vehicleService: VehicleService) {}

  async execute(
    input: ArchiveVehicleRequestDto,
  ): Promise<ArchiveVehicleResponseDto> {
    const { id } = input;

    const vehicle = await this.vehicleService.findById(String(id));
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.archivedAt) {
      throw new Error('Vehicle is already archived');
    }

    const archivedVehicle = await this.vehicleService.archive(String(id));

    return {
      id: archivedVehicle.id,
      archivedAt: archivedVehicle.archivedAt!,
    };
  }
}
