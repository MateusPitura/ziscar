import { Injectable } from '@nestjs/common';
import { Vehicle, VehicleSale, VehiclePurchase, Prisma } from '@prisma/client';
import type {
  SearchVehiclesRequestDto,
  SearchVehiclesResponseDto,
  FetchVehicleBrandsResponseDto,
} from 'src/entities/vehicle/dtos';
import { CreateInput, UpdateInput } from 'src/types';
import type { VEHICLE_WITH_PAYMENT_SELECT } from '../entities/vehicle/constants';

export type GetVehicleWithPaymentOutDto = Prisma.VehicleGetPayload<{
  select: typeof VEHICLE_WITH_PAYMENT_SELECT;
}>;

@Injectable()
export abstract class VehicleRepository {
  abstract create(data: CreateInput<Vehicle>): Promise<Vehicle>;
  abstract findById(id: number): Promise<GetVehicleWithPaymentOutDto | null>;
  abstract update(
    id: string,
    data: UpdateInput<Vehicle>,
  ): Promise<GetVehicleWithPaymentOutDto>;
  abstract fetchBrands(): Promise<FetchVehicleBrandsResponseDto>;
  abstract search(
    params: SearchVehiclesRequestDto,
  ): Promise<SearchVehiclesResponseDto>;
  abstract insertCharacteristics(
    vehicleId: number,
    characteristics: string[],
  ): Promise<void>;
  abstract updateCharacteristics(
    vehicleId: number,
    characteristics: string[],
  ): Promise<void>;
  abstract getVehicleSale(vehicleSaleId: string): Promise<VehicleSale | null>;
  abstract getVehicleWithPayment(
    vehicleId: string,
  ): Promise<GetVehicleWithPaymentOutDto | null>;
  abstract createPurchase(
    data: CreateInput<VehiclePurchase>,
  ): Promise<VehiclePurchase>;
  abstract updateVehiclePayment(
    vehicleId: string,
    payment: { purchaseDate?: Date; paidTo?: string | null },
  ): Promise<void>;
}
