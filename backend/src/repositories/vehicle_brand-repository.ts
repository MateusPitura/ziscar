import { VehicleBrand } from "@prisma/client";

export interface CreateVehicleBrand { }

export interface UpdateVehicleBrand { }


export abstract class VehicleBrandRepository {
    abstract create(data: CreateVehicleBrand): Promise<VehicleBrand>;
    abstract findById(id: string): Promise<VehicleBrand | null>;
    abstract update(id: string, data: UpdateVehicleBrand): Promise<void>;
    abstract delete(id: string): Promise<void>
}