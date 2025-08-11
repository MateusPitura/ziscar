import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import type {
  ToggleArchiveVehicleRequestDto,
  ToggleArchiveVehicleResponseDto,
} from '../dtos';

@Injectable()
export class ToggleArchiveVehicleUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    input: ToggleArchiveVehicleRequestDto,
  ): Promise<ToggleArchiveVehicleResponseDto> {
    const { id, archived } = input;

    const archivedAt = archived ? new Date() : null;

    const updatedVehicle = await this.prisma.vehicle.update({
      where: { id },
      data: { archivedAt },
      select: {
        id: true,
        archivedAt: true,
      },
    });

    return {
      id: updatedVehicle.id,
      archivedAt: updatedVehicle.archivedAt,
    };
  }
}
