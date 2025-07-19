import { VehicleCharacteristicValue } from "@prisma/client";

export interface CreateVehicleCharacteristicValue { }

export interface UpdateVehicleCharacteristicValue { }


export abstract class VehicleCharacteristicValueRepository {
    abstract create(data: CreateVehicleCharacteristicValue): Promise<VehicleCharacteristicValue>;
    abstract findById(id: string): Promise<VehicleCharacteristicValue | null>;
    abstract update(id: string, data: UpdateVehicleCharacteristicValue): Promise<void>;
    abstract delete(id: string): Promise<void>
}