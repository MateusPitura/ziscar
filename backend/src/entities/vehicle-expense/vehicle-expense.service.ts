import { Injectable } from "@nestjs/common";
import { VehicleExpense } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateVehicleExpense, UpdateVehicleExpense, VehicleExpenseRepository } from "src/repositories/vehicle_expense-repository";

@Injectable()
export class VehicleExpenseService implements VehicleExpenseRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateVehicleExpense): Promise<VehicleExpense> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<VehicleExpense | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateVehicleExpense): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}