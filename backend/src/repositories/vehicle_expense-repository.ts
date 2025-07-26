import { VehicleExpense } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export abstract class VehicleExpenseRepository {
    abstract create(data: CreateInput<VehicleExpense>): Promise<VehicleExpense>;
    abstract findById(id: string): Promise<VehicleExpense | null>;
    abstract update(id: string, data: UpdateInput<VehicleExpense>): Promise<void>;
    abstract delete(id: string): Promise<void>
}