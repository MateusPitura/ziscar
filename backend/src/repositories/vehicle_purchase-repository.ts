import { VehiclePurchase } from "@prisma/client";

export interface CreateVehiclePurchase { }

export interface UpdateVehiclePurchase { }


export abstract class VehiclePurchaseRepository {
    abstract create(data: CreateVehiclePurchase): Promise<VehiclePurchase>;
    abstract findById(id: string): Promise<VehiclePurchase | null>;
    abstract update(id: string, data: UpdateVehiclePurchase): Promise<void>;
    abstract delete(id: string): Promise<void>
}