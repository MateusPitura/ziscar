import { Injectable } from '@nestjs/common';
import {
  Vehicle,
  Prisma,
  VehicleCategory,
  VehicleStatus,
  VehicleSale,
  VehiclePurchase,
} from '@prisma/client';
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
import { GET_VEHICLE, VEHICLE_WITH_PAYMENT_SELECT } from './constants';
import { VEHICLE_INACTIVE_STATUS } from '@shared/types';

@Injectable()
export class VehicleService implements VehicleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<Vehicle>): Promise<Vehicle> {
    return this.prisma.vehicle.create({ data });
  }

  async findById(id: number): Promise<GetVehicleWithPaymentOutDto | null> {
    return await this.prisma.vehicle.findUnique({
      where: { id },
      select: VEHICLE_WITH_PAYMENT_SELECT,
    });
  }

  async findByChassiNumber(chassiNumber: string): Promise<Vehicle | null> {
    return await this.prisma.vehicle.findUnique({
      where: { chassiNumber },
    });
  }

  async findByPlateNumber(plateNumber: string): Promise<Vehicle | null> {
    return await this.prisma.vehicle.findUnique({
      where: { plateNumber },
    });
  }

  async update(
    id: string,
    data: UpdateInput<Vehicle>,
  ): Promise<GetVehicleWithPaymentOutDto> {
    return await this.prisma.vehicle.update({
      where: { id: Number(id) },
      data,
      select: VEHICLE_WITH_PAYMENT_SELECT,
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

    where.status = { not: VehicleStatus.SOLD };
    where.store = { archivedAt: null };

    if (params.storeId) where.storeId = Number(params.storeId);
    if (params.brandId) where.brandId = Number(params.brandId);

    if (params.status === VEHICLE_INACTIVE_STATUS) {
      where.archivedAt = { not: null };
    } else {
      where.archivedAt = null;
    }

    if (params.status && params.status !== VEHICLE_INACTIVE_STATUS) {
      where.status = params.status as VehicleStatus;
    }

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
      where.plateNumber = {
        contains: params.plateNumber,
        mode: 'insensitive',
      };

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
        orderBy: { modelName: 'asc' },
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

  async createPurchase(
    data: CreateInput<VehiclePurchase>,
  ): Promise<VehiclePurchase> {
    return this.prisma.vehiclePurchase.create({ data });
  }

  async updateVehiclePayment(
    vehicleId: string,
    payment: { purchaseDate?: Date; paidTo?: string | null },
  ): Promise<void> {
    const vehiclePurchase = await this.prisma.vehiclePurchase.findFirst({
      where: { vehicleId: Number(vehicleId) },
      include: { accountPayable: true },
    });

    if (!vehiclePurchase) {
      throw new Error('Vehicle purchase not found');
    }

    if (payment.purchaseDate) {
      await this.prisma.vehiclePurchase.update({
        where: { id: vehiclePurchase.id },
        data: { date: payment.purchaseDate },
      });
    }

    if (payment.paidTo !== undefined) {
      await this.prisma.accountPayable.update({
        where: { id: vehiclePurchase.accountPayableId },
        data: { paidTo: payment.paidTo },
      });
    }
  }
}
