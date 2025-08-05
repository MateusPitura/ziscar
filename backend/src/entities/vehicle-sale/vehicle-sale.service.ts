import { Injectable } from '@nestjs/common';
import { VehicleSale } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleSaleRepository } from 'src/repositories/vehicle_sale-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class VehicleSaleService implements VehicleSaleRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<VehicleSale>): Promise<VehicleSale> {
    return this.prisma.vehicleSale.create({ data });
  }

  async findById(id: string): Promise<VehicleSale | null> {
    const vehicleSale = await this.prisma.vehicleSale.findUnique({
      where: { id: Number(id) },
    });

    if (!vehicleSale) {
      return null;
    }

    return vehicleSale;
  }

  async update(id: string, data: UpdateInput<VehicleSale>): Promise<void> {
    await this.prisma.vehicleSale.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicleSale.delete({
      where: { id: Number(id) },
    });
  }
}
