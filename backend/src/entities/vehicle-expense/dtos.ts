import {
  ArchiveVehicleExpenseResponseSchema,
  InsertVehicleExpenseRequestSchema,
  InsertVehicleExpenseResponseSchema,
  UnarchiveVehicleExpenseResponseSchema,
  UpdateVehicleExpenseRequestSchema,
  VehicleExpenseResponseSchema,
} from '@shared/dtos';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class InsertVehicleExpenseRequestDto extends createZodDto(
  InsertVehicleExpenseRequestSchema,
) {}
export class UpdateVehicleExpenseRequestDto extends createZodDto(
  UpdateVehicleExpenseRequestSchema,
) {}
export type InsertVehicleExpenseResponseDto = z.infer<
  typeof InsertVehicleExpenseResponseSchema
>;
export type ArchiveVehicleExpenseResponseDto = z.infer<
  typeof ArchiveVehicleExpenseResponseSchema
>;
export type UnarchiveVehicleExpenseResponseDto = z.infer<
  typeof UnarchiveVehicleExpenseResponseSchema
>;

export type VehicleExpenseResponseDto = z.infer<
  typeof VehicleExpenseResponseSchema
>;
