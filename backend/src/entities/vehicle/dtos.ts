import {
  ArchiveVehicleResponseSchema,
  UnarchiveVehicleResponseSchema,
  ArchiveVehicleRequestSchema,
  UnarchiveVehicleRequestSchema,
  InsertVehicleRequestSchema,
  InsertVehicleResponseSchema,
  SearchVehiclesRequestSchema,
  SearchVehiclesResponseSchema,
  InsertVehicleExpenseRequestSchema,
  InsertVehicleExpenseResponseSchema,
  FetchVehicleBrandsResponseSchema,
  MakeVehicleSaleRequestSchema,
  MakeVehicleSaleResponseSchema,
  UpdateVehicleRequestSchema,
  UpdateVehicleResponseSchema,
} from '@shared/dtos/vehicle.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class InsertVehicleRequestDto extends createZodDto(
  InsertVehicleRequestSchema,
) {}
export class SearchVehiclesRequestDto extends createZodDto(
  SearchVehiclesRequestSchema,
) {}
export class InsertVehicleExpenseRequestDto extends createZodDto(
  InsertVehicleExpenseRequestSchema,
) {}
export class MakeVehicleSaleRequestDto extends createZodDto(
  MakeVehicleSaleRequestSchema,
) {}
export class UpdateVehicleRequestDto extends createZodDto(
  UpdateVehicleRequestSchema,
) {}
export class ArchiveVehicleRequestDto extends createZodDto(
  ArchiveVehicleRequestSchema,
) {}
export class UnarchiveVehicleRequestDto extends createZodDto(
  UnarchiveVehicleRequestSchema,
) {}

export type InsertVehicleResponseDto = z.infer<
  typeof InsertVehicleResponseSchema
>;
export type SearchVehiclesResponseDto = z.infer<
  typeof SearchVehiclesResponseSchema
>;
export type InsertVehicleExpenseResponseDto = z.infer<
  typeof InsertVehicleExpenseResponseSchema
>;
export type MakeVehicleSaleResponseDto = z.infer<
  typeof MakeVehicleSaleResponseSchema
>;
export type UpdateVehicleResponseDto = z.infer<
  typeof UpdateVehicleResponseSchema
>;
export type ArchiveVehicleResponseDto = z.infer<
  typeof ArchiveVehicleResponseSchema
>;
export type UnarchiveVehicleResponseDto = z.infer<
  typeof UnarchiveVehicleResponseSchema
>;
export type FetchVehicleBrandsResponseDto = z.infer<
  typeof FetchVehicleBrandsResponseSchema
>;
