import { VehicleCategory } from '@prisma/client';
import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const createVehicleBaseDTO = s.object({
  chassiNumber: s.string(),
  modelYear: s.number().nullable(),
  yearOfManufacture: s.number().nullable(),
  modelName: s.string(),
  category: s.nativeEnum(VehicleCategory),
  brandId: s.id(),
});

export class CreateVehicleBaseDTO extends createZodDto(createVehicleBaseDTO) {}
