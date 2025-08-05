import { Injectable } from '@nestjs/common';
import { VehicleExpense } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleExpenseRepository } from 'src/repositories/vehicle_expense-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class VehicleExpenseService implements VehicleExpenseRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<VehicleExpense>): Promise<VehicleExpense> {
    return this.prisma.vehicleExpense.create({ data });
  }

  async findById(id: string): Promise<VehicleExpense | null> {
    const vehicleExpense = await this.prisma.vehicleExpense.findUnique({
      where: { id: Number(id) },
    });

    if (!vehicleExpense) {
      return null;
    }

    return vehicleExpense;
  }

  async update(id: string, data: UpdateInput<VehicleExpense>): Promise<void> {
    await this.prisma.vehicleExpense.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicleExpense.delete({
      where: { id: Number(id) },
    });
  }
}
