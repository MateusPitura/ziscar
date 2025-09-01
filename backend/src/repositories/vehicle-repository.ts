import { Injectable } from '@nestjs/common';
import { Vehicle, VehicleSale, VehicleExpense, VehiclePurchase, Prisma } from '@prisma/client';
import type {
  SearchVehiclesRequestDto,
  SearchVehiclesResponseDto,
  FetchVehicleBrandsResponseDto,
  VehicleWithPaymentResponseDto,
} from 'src/entities/vehicle/dtos';
import { CreateInput, UpdateInput } from 'src/types';

export type GetVehicleWithPaymentOutDto = Prisma.VehicleGetPayload<{
  include: {
    brand: true;
    store: true;
    vehicleCharacteristicValues: true;
    vehiclePurchases: {
      include: {
        accountPayable: {
          include: {
            accountPayableInstallments: true;
          };
        };
        user: true;
      };
    };
  };
}>;

@Injectable()
export abstract class VehicleRepository {
  abstract create(data: CreateInput<Vehicle>): Promise<Vehicle>;
  abstract findById(id: string): Promise<Vehicle | null>;
  abstract update(id: string, data: UpdateInput<Vehicle>): Promise<Vehicle>;
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
  abstract fetchVehicleExpenses(vehicleId: string): Promise<VehicleExpense[]>;
  abstract fetchVehicleExpenseById(
    expenseId: string,
  ): Promise<VehicleExpense | null>;
  abstract updateVehicleExpense(
    expenseId: string,
    data: UpdateInput<VehicleExpense>,
  ): Promise<VehicleExpense>;
  abstract archiveVehicleExpense(expenseId: string): Promise<VehicleExpense>;
  abstract unarchiveVehicleExpense(expenseId: string): Promise<VehicleExpense>;
  abstract createPurchase(data: CreateInput<VehiclePurchase>): Promise<VehiclePurchase>;
}
