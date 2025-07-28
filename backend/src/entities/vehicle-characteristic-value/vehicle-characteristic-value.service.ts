import { Injectable } from "@nestjs/common";
import { VehicleCharacteristicValue } from "@prisma/client";
import { PrismaService } from "src/infra/database/prisma.service";
import { CreateVehicleCharacteristicValue, UpdateVehicleCharacteristicValue, VehicleCharacteristicValueRepository } from "src/repositories/vehicle_characteristic_value-repository";
import { CreateInput, UpdateInput } from "src/types";

@Injectable()
export class VehicleCharacteristicValueService implements VehicleCharacteristicValueRepository {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateInput<VehicleCharacteristicValue>): Promise<VehicleCharacteristicValue> {
        return this.prisma.vehicleCharacteristicValue.create({ data });
    }

    async findById(id: string): Promise<VehicleCharacteristicValue | null> {
        const vehicleCharacteristicValue = await this.prisma.vehicleCharacteristicValue.findUnique({
            where: { id: Number(id) }
        });

        if (!vehicleCharacteristicValue) {
            return null;
        }

        return vehicleCharacteristicValue;

    }

    async update(id: string, data: UpdateInput<VehicleCharacteristicValue>): Promise<void> {
        await this.prisma.vehicleCharacteristicValue.update({
            where: { id: Number(id) },
            data
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.vehicleCharacteristicValue.delete({
            where: { id: Number(id) }
        });
    }
}