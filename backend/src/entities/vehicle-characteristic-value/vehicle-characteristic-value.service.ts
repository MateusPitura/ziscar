import { Injectable } from "@nestjs/common";
import { VehicleCharacteristicValue } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { VehicleCharacteristicValueRepository } from "src/repositories/vehicle_characteristic_value-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class VehicleCharacteristicValueService implements VehicleCharacteristicValueRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInput<VehicleCharacteristicValue>): Promise<VehicleCharacteristicValue> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<VehicleCharacteristicValue | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: UpdateInput<VehicleCharacteristicValue>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}