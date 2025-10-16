import {
  ArchiveVehicleRequestSchema,
  ArchiveVehicleResponseSchema,
  FetchVehicleBrandsResponseSchema,
  InsertVehicleRequestSchema,
  InsertVehicleResponseSchema,
  MakeVehicleSaleRequestSchema,
  MakeVehicleSaleResponseSchema,
  SearchPaidToRequestSchema,
  SearchPaidToResponseSchema,
  SearchVehiclesRequestSchema,
  SearchVehiclesResponseSchema,
  UnarchiveVehicleRequestSchema,
  UnarchiveVehicleResponseSchema,
  UpdateVehicleRequestSchema,
  UpdateVehicleResponseSchema,
  VehicleSaleResponseSchema,
  VehicleWithPaymentResponseSchema,
} from '@shared/dtos/vehicle.dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class InsertVehicleRequestDto extends createZodDto(
  InsertVehicleRequestSchema,
) {}
export class SearchVehiclesRequestDto extends createZodDto(
  SearchVehiclesRequestSchema,
) {}

export class SearchPaidToRequestDto extends createZodDto(
  SearchPaidToRequestSchema,
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

export type SearchPaidToResponseDto = z.infer<
  typeof SearchPaidToResponseSchema
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

export type VehicleSaleResponseDto = z.infer<typeof VehicleSaleResponseSchema>;

export type VehicleWithPaymentResponseDto = z.infer<
  typeof VehicleWithPaymentResponseSchema
>;
