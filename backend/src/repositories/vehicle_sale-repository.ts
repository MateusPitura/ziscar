import { VehicleSale } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";


export abstract class VehicleSaleRepository {
    abstract create(data: CreateInput<VehicleSale>): Promise<VehicleSale>;
    abstract findById(id: string): Promise<VehicleSale | null>;
    abstract update(id: string, data: UpdateInput<VehicleSale>): Promise<void>;
    abstract delete(id: string): Promise<void>
}