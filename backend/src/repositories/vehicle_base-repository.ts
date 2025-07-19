import { VehicleBase } from "@prisma/client";

export interface CreateVehicleBase { }

export interface UpdateVehicleBase { }


export abstract class VehicleBaseRepository {
    abstract create(data: CreateVehicleBase): Promise<VehicleBase>;
    abstract findById(id: string): Promise<VehicleBase | null>;
    abstract update(id: string, data: UpdateVehicleBase): Promise<void>;
    abstract delete(id: string): Promise<void>
}