import { Injectable } from '@nestjs/common';
import {
  Vehicle,
  VehicleSale,
  VehicleExpense,
  VehiclePurchase,
  Prisma,
} from '@prisma/client';
import type {
  SearchVehiclesRequestDto,
  SearchVehiclesResponseDto,
  FetchVehicleBrandsResponseDto,
} from 'src/entities/vehicle/dtos';
import { CreateInput, UpdateInput } from 'src/types';
import type {
  VEHICLE_WITH_PAYMENT_SELECT,
  VEHICLE_EXPENSE_WITH_VEHICLE_SELECT,
  VEHICLE_EXPENSE_SELECT,
} from '../entities/vehicle/constants';

export type GetVehicleWithPaymentOutDto = Prisma.VehicleGetPayload<{
  select: typeof VEHICLE_WITH_PAYMENT_SELECT;
}>;

export type GetVehicleExpenseByIdOutDto = Prisma.VehicleExpenseGetPayload<{
  select: typeof VEHICLE_EXPENSE_WITH_VEHICLE_SELECT;
}>;

export type GetVehicleExpensesOutDto = Prisma.VehicleExpenseGetPayload<{
  select: typeof VEHICLE_EXPENSE_SELECT;
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
  abstract fetchVehicleExpenses(
    vehicleId: string,
  ): Promise<GetVehicleExpensesOutDto[]>;
  abstract getVehicleExpenseById(
    expenseId: string,
  ): Promise<GetVehicleExpenseByIdOutDto | null>;
  abstract updateVehicleExpense(
    expenseId: string,
    data: UpdateInput<VehicleExpense>,
  ): Promise<VehicleExpense>;
  abstract archiveVehicleExpense(expenseId: string): Promise<VehicleExpense>;
  abstract unarchiveVehicleExpense(expenseId: string): Promise<VehicleExpense>;
  abstract createPurchase(
    data: CreateInput<VehiclePurchase>,
  ): Promise<VehiclePurchase>;
  abstract updateVehiclePayment(
    vehicleId: string,
    payment: { purchaseDate?: Date; paidTo?: string | null },
  ): Promise<void>;
}
