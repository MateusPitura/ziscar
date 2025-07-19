import { VehicleExpense } from "@prisma/client";

export interface CreateVehicleExpense { }

export interface UpdateVehicleExpense { }


export abstract class VehicleExpenseRepository {
    abstract create(data: CreateVehicleExpense): Promise<VehicleExpense>;
    abstract findById(id: string): Promise<VehicleExpense | null>;
    abstract update(id: string, data: UpdateVehicleExpense): Promise<void>;
    abstract delete(id: string): Promise<void>
}