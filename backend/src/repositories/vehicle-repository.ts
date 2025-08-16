import { Injectable } from '@nestjs/common';
import { Vehicle } from '@prisma/client';
import type {
  SearchVehiclesRequestDto,
  SearchVehiclesResponseDto,
  FetchVehicleBrandsResponseDto,
} from 'src/entities/vehicle/dtos';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export abstract class VehicleRepository {
  abstract create(data: CreateInput<Vehicle>): Promise<Vehicle>;
  abstract findById(id: string): Promise<Vehicle | null>;
  abstract update(id: string, data: UpdateInput<Vehicle>): Promise<Vehicle>;
  abstract fetchBrands(): Promise<FetchVehicleBrandsResponseDto>;
  abstract search(
    params: SearchVehiclesRequestDto,
  ): Promise<SearchVehiclesResponseDto>;
}
