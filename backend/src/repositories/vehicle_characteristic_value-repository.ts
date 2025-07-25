import { VehicleCharacteristicValue } from "@prisma/client";
import { CreateInput, UpdateInput } from "src/types";

export interface CreateVehicleCharacteristicValue { }

export interface UpdateVehicleCharacteristicValue { }


export abstract class VehicleCharacteristicValueRepository {
    abstract create(data: CreateInput<VehicleCharacteristicValue>): Promise<VehicleCharacteristicValue>;
    abstract findById(id: string): Promise<VehicleCharacteristicValue | null>;
    abstract update(id: string, data: UpdateInput<VehicleCharacteristicValue>): Promise<void>;
    abstract delete(id: string): Promise<void>
}