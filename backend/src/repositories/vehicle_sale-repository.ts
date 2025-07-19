import { VehicleSale } from "@prisma/client";

export interface CreateVehicleSale { }

export interface UpdateVehicleSale { }


export abstract class VehicleSaleRepository {
    abstract create(data: CreateVehicleSale): Promise<VehicleSale>;
    abstract findById(id: string): Promise<VehicleSale | null>;
    abstract update(id: string, data: UpdateVehicleSale): Promise<void>;
    abstract delete(id: string): Promise<void>
}