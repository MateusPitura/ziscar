import { Injectable } from '@nestjs/common';
import { VehicleExpense } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VehicleExpenseRepository } from 'src/repositories/vehicle_expense-repository';
import { CreateInput, UpdateInput } from 'src/types';

@Injectable()
export class VehicleExpenseService implements VehicleExpenseRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<VehicleExpense>): Promise<VehicleExpense> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<VehicleExpense | null> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, data: UpdateInput<VehicleExpense>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
