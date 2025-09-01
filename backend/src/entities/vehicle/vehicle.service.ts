import { Injectable } from '@nestjs/common';
import {
  Vehicle,
  Prisma,
  VehicleCategory,
  VehicleStatus,
  VehicleSale,
  VehicleExpense,
  VehiclePurchase,
} from '@prisma/client';
import {
  GetVehicleExpenseByIdOutDto,
  GetVehicleExpensesOutDto,
} from 'src/repositories/vehicle-repository';
import {
  VehicleStatus as SharedVehicleStatus,
  VehicleCategory as SharedVehicleCategory,
  FuelType,
} from '@shared/enums';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  GetVehicleWithPaymentOutDto,
  VehicleRepository,
} from 'src/repositories/vehicle-repository';
import { CreateInput, UpdateInput } from 'src/types';
import type {
  SearchVehiclesRequestDto,
  SearchVehiclesResponseDto,
  FetchVehicleBrandsResponseDto,
} from './dtos';
import {
  GET_VEHICLE,
  VEHICLE_WITH_PAYMENT_SELECT,
  VEHICLE_EXPENSE_SELECT,
  VEHICLE_EXPENSE_WITH_VEHICLE_SELECT,
} from './constants';

@Injectable()
export class VehicleService implements VehicleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<Vehicle>): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data });
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: Number(id) },
    });

    if (!vehicle) {
      return null;
    }

    return vehicle;
  }

  async findUnique(id: number): Promise<Vehicle | null> {
    return await this.prisma.vehicle.findUnique({
      where: { id },
      include: { brand: true, vehicleCharacteristicValues: true },
    });
  }

  async update(id: string, data: UpdateInput<Vehicle>): Promise<Vehicle> {
    return await this.prisma.vehicle.update({
      where: { id: Number(id) },
      data,
    });
  }

  async archive(id: string): Promise<Vehicle> {
    return await this.prisma.vehicle.update({
      where: { id: Number(id) },
      data: {
        archivedAt: new Date(),
      },
    });
  }

  async unarchive(id: string): Promise<Vehicle> {
    return await this.prisma.vehicle.update({
      where: { id: Number(id) },
      data: {
        archivedAt: null,
      },
    });
  }

  async fetchBrands(): Promise<FetchVehicleBrandsResponseDto> {
    return await this.prisma.vehicleBrand.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async search(
    params: SearchVehiclesRequestDto,
  ): Promise<SearchVehiclesResponseDto> {
    const page = params.page;
    const take = params.limit;
    const skip = (page - 1) * take;

    const where: Prisma.VehicleWhereInput = {};

    if (params.storeId) where.storeId = Number(params.storeId);
    if (params.brandId) where.brandId = Number(params.brandId);
    if (params.status) where.status = params.status as VehicleStatus;
    if (params.category) where.category = params.category as VehicleCategory;
    if (params.modelYear) where.modelYear = Number(params.modelYear);
    if (params.yearOfManufacture)
      where.yearOfManufacture = Number(params.yearOfManufacture);

    if (params.modelName && params.modelName !== '')
      where.modelName = {
        contains: params.modelName,
        mode: 'insensitive',
      };

    if (params.plateNumber && params.plateNumber !== '')
      where.plateNumber = { equals: params.plateNumber };

    if (params.announcedPriceMin || params.announcedPriceMax)
      where.announcedPrice = {
        gte: params.announcedPriceMin ?? undefined,
        lte: params.announcedPriceMax ?? undefined,
      };

    if (params.startDate || params.endDate) {
      where.createdAt = {
        gte: params.startDate,
        lte: params.endDate,
      };
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.vehicle.findMany({
        where,
        skip,
        take,
        orderBy: params.orderBy ? { [params.orderBy]: 'asc' } : { id: 'desc' },
        select: GET_VEHICLE,
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    const mappedRows = rows.map((row) => ({
      ...row,
      status: row.status as SharedVehicleStatus,
      category: row.category as SharedVehicleCategory | null,
      fuelType: row.fuelType as FuelType,
    }));

    return { data: mappedRows, total: total };
  }

  async insertCharacteristics(
    vehicleId: number,
    characteristics: string[],
  ): Promise<void> {
    const data = characteristics.map((characteristic) => ({
      vehicleId: Number(vehicleId),
      characteristic,
    }));

    await this.prisma.vehicleCharacteristicValue.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async updateCharacteristics(
    vehicleId: number,
    characteristics: string[],
  ): Promise<void> {
    const vehicleIdNumber = Number(vehicleId);

    await this.prisma.vehicleCharacteristicValue.deleteMany({
      where: { vehicleId: vehicleIdNumber },
    });

    if (characteristics.length > 0) {
      const data = characteristics.map((characteristic) => ({
        vehicleId: vehicleIdNumber,
        characteristic,
      }));

      await this.prisma.vehicleCharacteristicValue.createMany({
        data,
      });
    }
  }

  async getVehicleSale(vehicleSaleId: string): Promise<VehicleSale | null> {
    return await this.prisma.vehicleSale.findUnique({
      where: { id: Number(vehicleSaleId) },
      include: {
        accountReceivable: true,
        accountPayable: true,
      },
    });
  }

  async getVehicleWithPayment(
    vehicleId: string,
  ): Promise<GetVehicleWithPaymentOutDto | null> {
    return await this.prisma.vehicle.findUnique({
      where: { id: Number(vehicleId) },
      select: VEHICLE_WITH_PAYMENT_SELECT,
    });
  }

  async fetchVehicleExpenses(
    vehicleId: string,
  ): Promise<GetVehicleExpensesOutDto[]> {
    return await this.prisma.vehicleExpense.findMany({
      where: { vehicleId: Number(vehicleId) },
      select: VEHICLE_EXPENSE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVehicleExpenseById(
    expenseId: string,
  ): Promise<GetVehicleExpenseByIdOutDto | null> {
    return await this.prisma.vehicleExpense.findUnique({
      where: { id: Number(expenseId) },
      select: VEHICLE_EXPENSE_WITH_VEHICLE_SELECT,
    });
  }

  async updateVehicleExpense(
    expenseId: string,
    data: UpdateInput<VehicleExpense>,
  ): Promise<VehicleExpense> {
    return await this.prisma.vehicleExpense.update({
      where: { id: Number(expenseId) },
      data,
    });
  }

  async archiveVehicleExpense(expenseId: string): Promise<VehicleExpense> {
    return await this.prisma.vehicleExpense.update({
      where: { id: Number(expenseId) },
      data: {
        archivedAt: new Date(),
      },
    });
  }

  async unarchiveVehicleExpense(expenseId: string): Promise<VehicleExpense> {
    return await this.prisma.vehicleExpense.update({
      where: { id: Number(expenseId) },
      data: {
        archivedAt: null,
      },
    });
  }

  async createPurchase(
    data: CreateInput<VehiclePurchase>,
  ): Promise<VehiclePurchase> {
    return this.prisma.vehiclePurchase.create({ data });
  }
}
