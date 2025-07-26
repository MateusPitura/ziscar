import { VehicleBrand } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export abstract class VehicleBrandRepository {
    abstract create(data: CreateInput<VehicleBrand>): Promise<VehicleBrand>;
    abstract findById(id: string): Promise<VehicleBrand | null>;
    abstract update(id: string, data: UpdateInput<VehicleBrand>): Promise<void>;
    abstract delete(id: string): Promise<void>
}