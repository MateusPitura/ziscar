import { Vehicle } from "@prisma/client";

export interface CreateVehicle { }

export interface UpdateVehicle { }


export abstract class VehicleRepository {
    abstract create(data: CreateVehicle): Promise<Vehicle>;
    abstract findById(id: string): Promise<Vehicle | null>;
    abstract update(id: string, data: UpdateVehicle): Promise<void>;
    abstract delete(id: string): Promise<void>
}