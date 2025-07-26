import { VehiclePurchase } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export abstract class VehiclePurchaseRepository {
    abstract create(data: CreateInput<VehiclePurchase>): Promise<VehiclePurchase>;
    abstract findById(id: string): Promise<VehiclePurchase | null>;
    abstract update(id: string, data: UpdateInput<VehiclePurchase>): Promise<void>;
    abstract delete(id: string): Promise<void>
}