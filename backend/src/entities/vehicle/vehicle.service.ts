import { Injectable } from '@nestjs/common';
import {
  Vehicle,
  Prisma,
  VehicleCategory,
  VehicleStatus,
} from '@prisma/client';
import {
  VehicleStatus as SharedVehicleStatus,
  VehicleCategory as SharedVehicleCategory,
} from '@shared/enums';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleRepository } from 'src/repositories/vehicle-repository';
import { CreateInput, UpdateInput } from 'src/types';
import type {
  SearchVehiclesRequestDto,
  SearchVehiclesResponseDto,
  FetchVehicleBrandsResponseDto,
} from './dtos';

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

  async update(id: string, data: UpdateInput<Vehicle>): Promise<void> {
    await this.prisma.vehicle.update({
      where: { id: Number(id) },
      data,
    });
  }

  async fetchBrands(): Promise<FetchVehicleBrandsResponseDto> {
    return await this.prisma.vehicleBrand.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async search(
    params: SearchVehiclesRequestDto,
  ): Promise<SearchVehiclesResponseDto> {
    const page = params.page;
    const take = params.limit;
    const skip = page * take;

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
        orderBy: { id: 'desc' },
        select: {
          id: true,
          chassiNumber: true,
          modelYear: true,
          yearOfManufacture: true,
          modelName: true,
          brandId: true,
          storeId: true,
          status: true,
          category: true,
          announcedPrice: true,
          plateNumber: true,
          archivedAt: true,
        },
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    const mappedRows = rows.map((row) => ({
      ...row,
      status: row.status as SharedVehicleStatus,
      category: row.category as SharedVehicleCategory | null,
    }));

    return { data: mappedRows, totalCount: total };
  }
}
