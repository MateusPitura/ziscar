import { Injectable } from "@nestjs/common";
import { VehicleCharacteristicValue } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateVehicleCharacteristicValue, UpdateVehicleCharacteristicValue, VehicleCharacteristicValueRepository } from "src/repositories/vehicle_characteristic_value-repository";

@Injectable()
export class VehicleCharacteristicValueService implements VehicleCharacteristicValueRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateVehicleCharacteristicValue): Promise<VehicleCharacteristicValue> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<VehicleCharacteristicValue | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateVehicleCharacteristicValue): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}