import {
  ToggleArchiveVehicleResponseSchema,
  ToggleArchiveVehicleRequestSchema,
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
import { z } from 'zod';

export type InsertVehicleRequestDto = z.infer<
  typeof InsertVehicleRequestSchema
>;
export type InsertVehicleResponseDto = z.infer<
  typeof InsertVehicleResponseSchema
>;

export type SearchVehiclesRequestDto = z.infer<
  typeof SearchVehiclesRequestSchema
>;
export type SearchVehiclesResponseDto = z.infer<
  typeof SearchVehiclesResponseSchema
>;

export type InsertVehicleExpenseRequestDto = z.infer<
  typeof InsertVehicleExpenseRequestSchema
>;
export type InsertVehicleExpenseResponseDto = z.infer<
  typeof InsertVehicleExpenseResponseSchema
>;

export type FetchVehicleBrandsResponseDto = z.infer<
  typeof FetchVehicleBrandsResponseSchema
>;

export type MakeVehicleSaleRequestDto = z.infer<
  typeof MakeVehicleSaleRequestSchema
>;
export type MakeVehicleSaleResponseDto = z.infer<
  typeof MakeVehicleSaleResponseSchema
>;

export type UpdateVehicleRequestDto = z.infer<
  typeof UpdateVehicleRequestSchema
>;
export type UpdateVehicleResponseDto = z.infer<
  typeof UpdateVehicleResponseSchema
>;

export type ToggleArchiveVehicleRequestDto = z.infer<
  typeof ToggleArchiveVehicleRequestSchema
>;
export type ToggleArchiveVehicleResponseDto = z.infer<
  typeof ToggleArchiveVehicleResponseSchema
>;
