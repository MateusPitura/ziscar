import { VehicleCategory } from '@prisma/client';
import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const updateVehicleBaseDTO = s.object({
  modelYear: s.number().optional(),
  yearOfManufacture: s.number().optional(),
  modelName: s.string().optional(),
  category: s.nativeEnum(VehicleCategory).optional(),
  brandId: s.id().optional(),
});

export class UpdateVehicleBaseDTO extends createZodDto(updateVehicleBaseDTO) {}
