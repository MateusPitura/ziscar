import { Injectable } from '@nestjs/common';
import { VehicleExpense } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';
import {
  GetVehicleExpenseByIdOutDto,
  GetVehicleExpensesOutDto,
  VehicleExpenseRepository,
} from 'src/repositories/vehicle_expense-repository';
import { CreateInput, UpdateInput } from 'src/types';
import {
  VEHICLE_EXPENSE_SELECT,
  VEHICLE_EXPENSE_WITH_VEHICLE_SELECT,
} from './constants';

@Injectable()
export class VehicleExpenseService implements VehicleExpenseRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInput<VehicleExpense>): Promise<VehicleExpense> {
    return this.prisma.vehicleExpense.create({ data });
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

  async fetchVehicleExpenses(
    vehicleId: string,
    enterpriseId: number,
  ): Promise<GetVehicleExpensesOutDto[]> {
    return await this.prisma.vehicleExpense.findMany({
      where: {
        vehicle: {
          id: Number(vehicleId),
          store: {
            enterpriseId,
          },
        },
      },
      select: VEHICLE_EXPENSE_SELECT,
      orderBy: { competencyDate: 'desc' },
    });
  }

  async getVehicleExpenseById(
    expenseId: string,
    enterpriseId: number,
  ): Promise<GetVehicleExpenseByIdOutDto | null> {
    return await this.prisma.vehicleExpense.findUnique({
      where: { id: Number(expenseId), vehicle: { store: { enterpriseId } } },
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
}
