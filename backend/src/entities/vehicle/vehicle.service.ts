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
import { GET_VEHICLE } from './constants';

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
        orderBy: { id: 'desc' },
        select: GET_VEHICLE,
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
    characteristics: Array<{ id?: number; characteristic: string }>,
  ): Promise<void> {
    const vehicleIdNumber = Number(vehicleId);

    const existingCharacteristics =
      await this.prisma.vehicleCharacteristicValue.findMany({
        where: { vehicleId: vehicleIdNumber },
        select: { id: true },
      });

    const existingIds = existingCharacteristics.map((char) => char.id);
    const providedIds = characteristics
      .filter((char) => char.id !== undefined)
      .map((char) => char.id!);

    const idsToDelete = existingIds.filter((id) => !providedIds.includes(id));

    const characteristicsToUpdate = characteristics.filter(
      (char) => char.id !== undefined && existingIds.includes(char.id),
    );

    const characteristicsToInsert = characteristics.filter(
      (char) => char.id === undefined,
    );

    await this.prisma.$transaction(async (prisma) => {
      if (idsToDelete.length > 0) {
        await prisma.vehicleCharacteristicValue.deleteMany({
          where: {
            id: { in: idsToDelete },
            vehicleId: vehicleIdNumber,
          },
        });
      }

      for (const char of characteristicsToUpdate) {
        await prisma.vehicleCharacteristicValue.update({
          where: { id: char.id! },
          data: { characteristic: char.characteristic },
        });
      }

      if (characteristicsToInsert.length > 0) {
        const dataToInsert = characteristicsToInsert.map((char) => ({
          vehicleId: vehicleIdNumber,
          characteristic: char.characteristic,
        }));

        await prisma.vehicleCharacteristicValue.createMany({
          data: dataToInsert,
        });
      }
    });
  }
}
